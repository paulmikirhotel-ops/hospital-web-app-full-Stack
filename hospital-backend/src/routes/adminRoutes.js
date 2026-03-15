const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const Blog        = require('../models/Blog');
const Service     = require('../models/Service');
const Appointment = require('../models/Appointment');
const Comment     = require('../models/Comment');
const Doctor      = require('../models/Doctor');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/* ─────────────────────────────────────────────
   HELPER: build date filter from query params
   ?date=2024-03-15
   ?month=2024-03
   ?year=2024
   ?from=2024-01-01&to=2024-03-31
───────────────────────────────────────────── */
const buildDateFilter = (query) => {
  const { date, month, year, from, to } = query;
  let filter = {};

  if (date) {
    const d     = new Date(date);
    const start = new Date(d); start.setHours(0,0,0,0);
    const end   = new Date(d); end.setHours(23,59,59,999);
    filter = { createdAt: { $gte: start, $lte: end } };
  } else if (month) {
    const [y, m] = month.split('-').map(Number);
    const start  = new Date(y, m-1, 1);
    const end    = new Date(y, m,   1);
    filter = { createdAt: { $gte: start, $lt: end } };
  } else if (year) {
    const y     = parseInt(year);
    const start = new Date(y,   0, 1);
    const end   = new Date(y+1, 0, 1);
    filter = { createdAt: { $gte: start, $lt: end } };
  } else if (from || to) {
    filter.createdAt = {};
    if (from) { const d = new Date(from); d.setHours(0,0,0,0);     filter.createdAt.$gte = d; }
    if (to)   { const d = new Date(to);   d.setHours(23,59,59,999); filter.createdAt.$lte = d; }
  }
  return filter;
};

/* ─────────────────────────────────────────────
   CHART BUILDERS
───────────────────────────────────────────── */
function buildRevenueByMonth(appointments) {
  const map = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    map[key]  = { month: key, revenue: 0, count: 0 };
  }
  appointments.filter(a => a.payment).forEach(a => {
    const d   = new Date(a.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (map[key]) { map[key].revenue += a.amount || 0; map[key].count++; }
  });
  return Object.values(map);
}

function buildRevenueByYear(appointments) {
  const map = {};
  appointments.filter(a => a.payment).forEach(a => {
    const y = new Date(a.createdAt).getFullYear();
    if (!map[y]) map[y] = { year: y, revenue: 0, count: 0 };
    map[y].revenue += a.amount || 0;
    map[y].count++;
  });
  return Object.values(map).sort((a,b) => a.year - b.year);
}

function buildAppointmentsByDay(appointments) {
  const map = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d   = new Date(now); d.setDate(now.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key]  = { date: key, total: 0, paid: 0, cancelled: 0 };
  }
  appointments.forEach(a => {
    const key = new Date(a.createdAt).toISOString().split('T')[0];
    if (map[key]) {
      map[key].total++;
      if (a.payment)                map[key].paid++;
      if (a.status === 'Cancelled') map[key].cancelled++;
    }
  });
  return Object.values(map);
}

function buildAppointmentsByMonth(appointments) {
  const map = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    map[key]  = { month: key, total: 0, paid: 0, cancelled: 0 };
  }
  appointments.forEach(a => {
    const d   = new Date(a.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (map[key]) {
      map[key].total++;
      if (a.payment)                map[key].paid++;
      if (a.status === 'Cancelled') map[key].cancelled++;
    }
  });
  return Object.values(map);
}

function buildStatusBreakdown(appointments) {
  const map = { Pending:0, Confirmed:0, Cancelled:0, Completed:0 };
  appointments.forEach(a => { if (map[a.status] !== undefined) map[a.status]++; });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

function buildTopDoctors(appointments) {
  const map = {};
  appointments.forEach(a => {
    const doc = a.doctorId;
    if (!doc) return;
    const id  = doc._id?.toString() || doc.toString();
    if (!map[id]) map[id] = { doctorId: id, sessions: 0, revenue: 0, name: doc.name || 'Unknown', image: doc.image || '' };
    map[id].sessions++;
    if (a.payment) map[id].revenue += a.amount || 0;
  });
  return Object.values(map).sort((a,b) => b.sessions - a.sessions).slice(0,5);
}

function buildHourlyDistribution(appointments) {
  const map = {};
  for (let h = 0; h < 24; h++) map[h] = { hour: h, count: 0 };
  appointments.forEach(a => {
    if (!a.slot) return;
    const match = a.slot.match(/^(\d{1,2})/);
    if (match) {
      const h = parseInt(match[1]);
      if (map[h] !== undefined) map[h].count++;
    }
  });
  return Object.values(map);
}

/* ─────────────────────────────────────────────
   1. MASTER STATS  GET /api/admin/stats
───────────────────────────────────────────── */
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req.query);
    const hasFilter  = Object.keys(dateFilter).length > 0;

    const [users, blogs, services, allAppointments, commentCount, doctors] = await Promise.all([
      User.find({}, 'role createdAt'),
      Blog.countDocuments(),
      Service.countDocuments(),
      Appointment.find()
        .populate('userId',   'name email image')
        .populate('doctorId', 'name image specialization')
        .sort({ createdAt: -1 }),
      Comment.countDocuments(),
      Doctor.find({}, 'name image specialization available isApproved'),
    ]);

    const appointments = hasFilter
      ? allAppointments.filter(a => {
          const d = new Date(a.createdAt);
          if (dateFilter.createdAt?.$gte && d < dateFilter.createdAt.$gte) return false;
          if (dateFilter.createdAt?.$lte && d > dateFilter.createdAt.$lte) return false;
          if (dateFilter.createdAt?.$lt  && d >= dateFilter.createdAt.$lt) return false;
          return true;
        })
      : allAppointments;

    const revenue        = appointments.filter(a => a.payment).reduce((acc, a) => acc + (a.amount || 0), 0);
    const allTimeRevenue = allAppointments.filter(a => a.payment).reduce((acc, a) => acc + (a.amount || 0), 0);

    const recentBlogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      filterApplied: hasFilter ? req.query : null,
      stats: {
        revenue,
        allTimeRevenue,
        totalAppointments:     appointments.length,
        allTimeAppointments:   allAppointments.length,
        paidAppointments:      appointments.filter(a => a.payment).length,
        pendingAppointments:   appointments.filter(a => !a.payment && a.status !== 'Cancelled').length,
        cancelledAppointments: appointments.filter(a => a.status === 'Cancelled').length,
        completedAppointments: appointments.filter(a => a.status === 'Completed').length,
        patients:  users.filter(u => u.role === 'user').length,
        doctors:   doctors.length,
        approvedDoctors: doctors.filter(d => d.isApproved === 'approved').length,
        pendingDoctors:  doctors.filter(d => d.isApproved === 'pending').length,
        services,
        blogs,
        comments: commentCount,
        newPatientsThisMonth: users.filter(u => {
          const d = new Date(u.createdAt), n = new Date();
          return u.role === 'user' && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
        }).length,
      },
      recentActivity: appointments.slice(0, 50),
      recentBlogs,
      charts: {
        revenueByMonth:       buildRevenueByMonth(allAppointments),
        revenueByYear:        buildRevenueByYear(allAppointments),
        appointmentsByDay:    buildAppointmentsByDay(allAppointments),
        appointmentsByMonth:  buildAppointmentsByMonth(allAppointments),
        statusBreakdown:      buildStatusBreakdown(appointments),
        topDoctors:           buildTopDoctors(allAppointments),
        hourlyDistribution:   buildHourlyDistribution(allAppointments),
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   2. MARK AS PAID  POST /api/admin/mark-as-paid
───────────────────────────────────────────── */
router.post('/mark-as-paid', verifyToken, isAdmin, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) return res.status(400).json({ success: false, message: 'appointmentId required' });

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { payment: true, status: 'Confirmed' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    res.json({ success: true, message: 'Transaction verified.', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   3. PENDING DOCTORS  GET /api/admin/pending-doctors
───────────────────────────────────────────── */
router.get('/pending-doctors', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: 'pending' })
      .populate('userId', 'name email image createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   4. ALL DOCTORS  GET /api/admin/all-doctors
───────────────────────────────────────────── */
router.get('/all-doctors', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email image createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   5. APPROVE DOCTOR  PATCH /api/admin/approve-doctor/:id
───────────────────────────────────────────── */
router.patch('/approve-doctor/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: 'approved' },
      { new: true }
    ).populate('userId', 'name email');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: `Dr. ${doctor.name} has been approved.`, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   6. REJECT DOCTOR  PATCH /api/admin/reject-doctor/:id
───────────────────────────────────────────── */
router.patch('/reject-doctor/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: 'cancelled' },
      { new: true }
    ).populate('userId', 'name email');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: `Dr. ${doctor.name} has been rejected.`, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   7. FILTERED APPOINTMENTS  GET /api/admin/appointments
───────────────────────────────────────────── */
router.get('/appointments', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateFilter        = buildDateFilter(req.query);
    const { status, doctorId, search } = req.query;

    if (status)   dateFilter.status   = status;
    if (doctorId) dateFilter.doctorId = doctorId;

    let appointments = await Appointment.find(dateFilter)
      .populate('userId',   'name email image')
      .populate('doctorId', 'name image specialization')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      appointments = appointments.filter(a =>
        a.userId?.name?.toLowerCase().includes(q)   ||
        a.doctorId?.name?.toLowerCase().includes(q) ||
        a.slot?.toLowerCase().includes(q)           ||
        a.date?.toLowerCase().includes(q)
      );
    }

    const revenue = appointments.filter(a => a.payment).reduce((acc, a) => acc + (a.amount || 0), 0);
    res.status(200).json({ success: true, count: appointments.length, revenue, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;