const express       = require('express');
const router        = express.Router();
const LoginActivity = require('../models/LoginActivity');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/**
 * Build a $match date filter from query params.
 * Supports: period (today|week|month|year), from/to range, or no filter.
 */
const buildDateMatch = (query) => {
  const { period, from, to } = query;

  if (from || to) {
    const range = {};
    if (from) range.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
    return { loginAt: range };
  }

  if (period) {
    const now   = new Date();
    const start = new Date();

    if (period === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }

    return { loginAt: { $gte: start, $lte: now } };
  }

  return {};
};

/* ─────────────────────────────────────────────
   1. SUMMARY STATS
   GET /api/login-activity/summary?period=today|week|month|year
   Returns: total logins, breakdown by role, unique users
───────────────────────────────────────────── */
router.get('/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query);

    // Total logins + breakdown by role
    const byRole = await LoginActivity.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id:          '$role',
          logins:       { $sum: 1 },
          uniqueUsers:  { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          role:         '$_id',
          logins:       1,
          uniqueUsers:  { $size: '$uniqueUsers' },
          _id:          0,
        },
      },
      { $sort: { logins: -1 } },
    ]);

    // Grand totals
    const totalLogins      = byRole.reduce((a, b) => a + b.logins, 0);
    const totalUniqueUsers = await LoginActivity.distinct('userId', dateMatch).then(a => a.length);

    // Most active period label
    const period = req.query.period || 'all';

    res.json({
      success: true,
      period,
      totalLogins,
      totalUniqueUsers,
      byRole,
    });
  } catch (err) {
    console.error('Login summary error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   2. LOGINS BY DAY (for bar chart)
   GET /api/login-activity/by-day?period=week|month|year&role=all|user|doctor|admin
   Returns: array of { date, total, user, doctor, admin }
───────────────────────────────────────────── */
router.get('/by-day', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role = 'all' } = req.query;
    const dateMatch        = buildDateMatch(req.query);
    if (role !== 'all') dateMatch.role = role;

    const rows = await LoginActivity.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$loginAt' },
            },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Pivot into { date, user, doctor, admin, total }
    const map = {};
    rows.forEach(r => {
      const { date, role: rl } = r._id;
      if (!map[date]) map[date] = { date, user: 0, doctor: 0, admin: 0, total: 0 };
      map[date][rl]    = (map[date][rl] || 0) + r.count;
      map[date].total += r.count;
    });

    res.json({
      success: true,
      data:    Object.values(map).sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch (err) {
    console.error('Login by-day error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   3. LOGINS BY HOUR (heatmap / peak hours)
   GET /api/login-activity/by-hour?period=week|month
───────────────────────────────────────────── */
router.get('/by-hour', verifyToken, isAdmin, async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query);

    const rows = await LoginActivity.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id:   { $hour: '$loginAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill all 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour:  i,
      count: 0,
    }));
    rows.forEach(r => { hours[r._id].count = r.count; });

    res.json({ success: true, data: hours });
  } catch (err) {
    console.error('Login by-hour error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   4. RECENT LOGINS (live feed)
   GET /api/login-activity/recent?limit=20&role=all|user|doctor|admin
───────────────────────────────────────────── */
router.get('/recent', verifyToken, isAdmin, async (req, res) => {
  try {
    const { limit = 20, role = 'all' } = req.query;
    const match = {};
    if (role !== 'all') match.role = role;

    const records = await LoginActivity.find(match)
      .sort({ loginAt: -1 })
      .limit(Number(limit))
      .populate('userId', 'name email image')
      .lean();

    res.json({ success: true, data: records });
  } catch (err) {
    console.error('Recent logins error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   5. LOGINS BY MONTH (trend line)
   GET /api/login-activity/by-month?year=2025
───────────────────────────────────────────── */
router.get('/by-month', verifyToken, isAdmin, async (req, res) => {
  try {
    const year      = parseInt(req.query.year) || new Date().getFullYear();
    const dateMatch = {
      loginAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31T23:59:59`),
      },
    };

    const rows = await LoginActivity.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: {
            month: { $month: '$loginAt' },
            role:  '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    // Fill all 12 months
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const months = MONTHS.map((label, i) => ({
      month: label, monthNum: i + 1, user: 0, doctor: 0, admin: 0, total: 0,
    }));

    rows.forEach(r => {
      const m = months[r._id.month - 1];
      if (m) {
        m[r._id.role]  = (m[r._id.role] || 0) + r.count;
        m.total       += r.count;
      }
    });

    res.json({ success: true, year, data: months });
  } catch (err) {
    console.error('Login by-month error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;