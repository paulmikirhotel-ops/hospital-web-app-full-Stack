const express    = require('express');
const router     = express.Router();
const User        = require('../models/User');
const Blog        = require('../models/Blog');
const Service     = require('../models/Service');
const Appointment = require('../models/Appointment');
const Comment     = require('../models/Comment');
const Doctor      = require('../models/Doctor');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/* ─────────────────────────────────────────────
   HELPER: parse date range from query params
   Supports: ?date=2024-03-15
             ?month=2024-03
             ?year=2024
             ?from=2024-01-01&to=2024-03-31
───────────────────────────────────────────── */
const buildDateFilter = (query) => {
  const { date, month, year, from, to } = query;
  let filter = {};

  if (date) {
    // exact date: date field is stored as string "DD/MM/YYYY" or "YYYY-MM-DD"
    // we filter createdAt for that calendar day
    const d     = new Date(date);
    const start = new Date(d); start.setHours(0,0,0,0);
    const end   = new Date(d); end.setHours(23,59,59,999);
    filter = { createdAt: { $gte: start, $lte: end } };
  } else if (month) {
    // month: "2024-03"
    const [y, m]  = month.split('-').map(Number);
    const start   = new Date(y, m-1, 1);
    const end     = new Date(y, m,   1);
    filter = { createdAt: { $gte: start, $lt: end } };
  } else if (year) {
    const y       = parseInt(year);
    const start   = new Date(y,  0, 1);
    const end     = new Date(y+1,0, 1);
    filter = { createdAt: { $gte: start, $lt: end } };
  } else if (from || to) {
    filter.createdAt = {};
    if (from) { const d = new Date(from); d.setHours(0,0,0,0);   filter.createdAt.$gte = d; }
    if (to)   { const d = new Date(to);   d.setHours(23,59,59,999); filter.createdAt.$lte = d; }
  }

  return filter;
};

/* ─────────────────────────────────────────────
   1. MASTER STATS  GET /api/admin/stats
───────────────────────────────────────────── */
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req.query);
    const hasFilter  = Object.keys(dateFilter).length > 0;

    const [users, blogs, services, allAppointments, filteredAppointments, commentCount, doctors] =
      await Promise.all([
        User.find({}, 'role createdAt'),
        Blog.countDocuments(),
        Service.countDocuments(),
        Appointment.find()
          .populate('userId',   'name email')
          .populate('doctorId', 'name image specialization')
          .sort({ createdAt: -1 }),
        hasFilter
          ? Appointment.find(dateFilter)
              .populate('userId',   'name email')
              .populate('doctorId', 'name image specialization')
              .sort({ createdAt: -1 })
          : null,
        Comment.countDocuments(),
        Doctor.find({}, 'name image specialization available'),
      ]);

    const appointments = hasFilter ? filteredAppointments : allAppointments;

    // ── Revenue ──
    const revenue = appointments
      .filter(a => a.payment)
      .reduce((acc, a) => acc + (a.amount || 0), 0);

    // ── All-time revenue (for comparison) ──
    const allTimeRevenue = allAppointments
      .filter(a => a.payment)
      .reduce((acc, a) => acc + (a.amount || 0), 0);

    // ── Revenue by month (last 12 months) ──
    const revenueByMonth = buildRevenueByMonth(allAppointments);

    // ── Revenue by year ──
    const revenueByYear = buildRevenueByYear(allAppointments);

    // ── Appointments by day (last 30 days) ──
    const appointmentsByDay = buildAppointmentsByDay(allAppointments);

    // ── Appointments by month ──
    const appointmentsByMonth = buildAppointmentsByMonth(allAppointments);

    // ── Status breakdown ──
    const statusBreakdown = buildStatusBreakdown(appointments);

    // ── Top doctors by sessions ──
    const topDoctors = buildTopDoctors(allAppointments, doctors);

    // ── Hourly distribution (by slot) ──
    const hourlyDistribution = buildHourlyDistribution(allAppointments);

    // ── Recent blogs ──
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
        totalAppointments:    appointments.length,
        allTimeAppointments:  allAppointments.length,
        paidAppointments:     appointments.filter(a => a.payment).length,
        pendingAppointments:  appointments.filter(a => !a.payment).length,
        cancelledAppointments:appointments.filter(a => a.status === 'Cancelled').length,
        completedAppointments:appointments.filter(a => a.status === 'Completed').length,
        patients:  users.filter(u => u.role === 'user').length,
        doctors:   users.filter(u => u.role === 'doctor').length,
        services,
        blogs,
        comments: commentCount,
        newPatientsThisMonth: users.filter(u => {
          const d = new Date(u.createdAt);
          const n = new Date();
          return u.role === 'user' && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
        }).length,
      },
      recentActivity:       appointments.slice(0, 50),
      recentBlogs,
      charts: {
        revenueByMonth,
        revenueByYear,
        appointmentsByDay,
        appointmentsByMonth,
        statusBreakdown,
        topDoctors,
        hourlyDistribution,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   2. FILTERED APPOINTMENTS  GET /api/admin/appointments
   ?date=  ?month=  ?year=  ?from=  ?to=
   ?status=  ?doctorId=  ?search=
───────────────────────────────────────────── */
router.get('/appointments', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req.query);
    const { status, doctorId, search } = req.query;

    if (status)   dateFilter.status   = status;
    if (doctorId) dateFilter.doctorId = doctorId;

    let appointments = await Appointment.find(dateFilter)
      .populate('userId',   'name email')
      .populate('doctorId', 'name image specialization')
      .sort({ createdAt: -1 });

    // text search on patient/doctor name
    if (search) {
      const q = search.toLowerCase();
      appointments = appointments.filter(a =>
        a.userId?.name?.toLowerCase().includes(q)  ||
        a.doctorId?.name?.toLowerCase().includes(q) ||
        a.slot?.toLowerCase().includes(q)
      );
    }

    const revenue = appointments.filter(a => a.payment).reduce((acc, a) => acc + (a.amount || 0), 0);

    res.status(200).json({
      success:      true,
      count:        appointments.length,
      revenue,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   3. REVENUE ANALYTICS  GET /api/admin/revenue
───────────────────────────────────────────── */
router.get('/revenue', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req.query);
    const appointments = await Appointment.find({ ...dateFilter, payment: true }).sort({ createdAt: 1 });

    const daily   = buildRevenueByDay(appointments);
    const monthly = buildRevenueByMonth(appointments);
    const yearly  = buildRevenueByYear(appointments);
    const total   = appointments.reduce((a, b) => a + (b.amount || 0), 0);

    res.status(200).json({ success:true, total, daily, monthly, yearly });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

function buildRevenueByDay(appointments) {
  const map = {};
  appointments.forEach(a => {
    const key = new Date(a.createdAt).toISOString().split('T')[0];
    if (!map[key]) map[key] = { date: key, revenue: 0, count: 0 };
    map[key].revenue += a.amount || 0;
    map[key].count++;
  });
  return Object.values(map).sort((a,b) => new Date(a.date) - new Date(b.date));
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
      if (a.payment)              map[key].paid++;
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
      if (a.payment)              map[key].paid++;
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

function buildTopDoctors(appointments, doctors) {
  const map = {};
  appointments.forEach(a => {
    const id = a.doctorId?._id?.toString() || a.doctorId?.toString();
    if (!id) return;
    if (!map[id]) map[id] = { doctorId: id, sessions: 0, revenue: 0, name: a.doctorId?.name || 'Unknown', image: a.doctorId?.image || '' };
    map[id].sessions++;
    if (a.payment) map[id].revenue += a.amount || 0;
  });
  return Object.values(map).sort((a,b) => b.sessions - a.sessions).slice(0, 5);
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

module.exports = router;