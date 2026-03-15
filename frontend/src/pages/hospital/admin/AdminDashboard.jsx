import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IoWalletOutline, IoPeopleOutline, IoCalendarOutline,
  IoMedicalOutline, IoDocumentTextOutline, IoLayersOutline,
  IoChatbubblesOutline, IoSearchOutline, IoCheckmarkCircle,
  IoArrowForwardOutline, IoTimeOutline, IoAddCircleOutline,
  IoFilterOutline, IoCloseOutline, IoTrendingUpOutline,
  IoTrendingDownOutline, IoStatsChartOutline, IoRefreshOutline,
  IoChevronDownOutline, IoPersonOutline, IoCheckmarkCircleOutline,
  IoCloseCircleOutline, IoAlertCircleOutline, IoEyeOutline,
} from 'react-icons/io5';

const API_BASE = 'http://localhost:5001/api';

/* ─────────────────────────────────────────────
   TINY INLINE BAR CHART (pure CSS/motion)
───────────────────────────────────────────── */
const MiniBarChart = ({ data = [], valueKey = 'revenue', labelKey = 'month', color = '#2563eb', height = 80 }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const show = data.slice(-12);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height, width: '100%' }}>
      {show.map((d, i) => {
        const pct = ((d[valueKey] || 0) / max) * 100;
        const label = d[labelKey] || '';
        const shortLabel = label.length > 7 ? label.slice(-5) : label;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(pct, 2)}%` }}
              transition={{ delay: i * 0.03, duration: 0.5, ease: 'easeOut' }}
              style={{ width: '100%', borderRadius: '4px 4px 2px 2px', background: `linear-gradient(to top, ${color}, ${color}99)`, minHeight: 3, cursor: 'default', position: 'relative' }}
              title={`${shortLabel}: ${d[valueKey]}`}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ── Donut chart (pure SVG) ── */
const DonutChart = ({ data = [], size = 120 }) => {
  const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
  const total  = data.reduce((a, b) => a + b.count, 0) || 1;
  let cumAngle = -90;
  const r = (size / 2) - 12;
  const cx = size / 2, cy = size / 2;

  const slices = data.map((d, i) => {
    const angle   = (d.count / total) * 360;
    const start   = cumAngle;
    cumAngle     += angle;
    const end     = cumAngle;
    const startR  = (start * Math.PI) / 180;
    const endR    = (end   * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startR), y1 = cy + r * Math.sin(startR);
    const x2 = cx + r * Math.cos(endR),   y2 = cy + r * Math.sin(endR);
    const large = angle > 180 ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: COLORS[i % COLORS.length], label: d.status, count: d.count };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <motion.path key={i} d={s.d} fill={s.color} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ cursor: 'default' }}>
            <title>{s.label}: {s.count}</title>
          </motion.path>
        ))}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="white"/>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fontWeight="700" fill="#94a3b8" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }}/>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>{s.label}</span>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#0f172a', marginLeft: 'auto' }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ label, value, icon, color, isLive, sub, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className={`${color} p-6 lg:p-8 rounded-[2.5rem] text-white shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group`}
  >
    {isLive && (
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"/>
        <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
      </div>
    )}
    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 lg:mb-6 group-hover:rotate-12 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
    <h3 className="text-3xl lg:text-4xl font-black tracking-tighter">{value}</h3>
    {sub && <p className="text-[9px] font-bold opacity-50 mt-1 uppercase tracking-widest">{sub}</p>}
    {trend !== undefined && (
      <div className={`flex items-center gap-1 mt-2 text-[9px] font-black uppercase ${trend >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
        {trend >= 0 ? <IoTrendingUpOutline size={12}/> : <IoTrendingDownOutline size={12}/>}
        {Math.abs(trend)}% vs last period
      </div>
    )}
  </motion.div>
);

/* ── Mini card ── */
const MiniCard = ({ label, value, icon, highlight, sub }) => (
  <div className={`bg-white p-4 lg:p-6 rounded-[2rem] border ${highlight ? 'border-blue-100' : 'border-slate-50'} flex items-center gap-3 lg:gap-4 transition-all hover:shadow-lg`}>
    <div className={`w-10 h-10 lg:w-11 lg:h-11 ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-50 text-blue-600'} rounded-2xl flex items-center justify-center text-lg lg:text-xl shadow-sm flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-widest truncate">{label}</p>
      <h4 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
      {sub && <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   DATE FILTER BAR
───────────────────────────────────────────── */
const FilterBar = ({ filters, setFilters, onApply, onClear, loading }) => {
  const [mode, setMode] = useState('all'); // 'all' | 'date' | 'month' | 'year' | 'range'

  const handleModeChange = (m) => {
    setMode(m);
    setFilters({ date: '', month: '', year: '', from: '', to: '' });
  };

  const modes = [
    { id: 'all',   label: 'All Time' },
    { id: 'date',  label: 'By Date'  },
    { id: 'month', label: 'By Month' },
    { id: 'year',  label: 'By Year'  },
    { id: 'range', label: 'Date Range' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2rem] p-4 lg:p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <IoFilterOutline size={18} className="text-blue-600"/>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Filter Analytics</span>
        </div>
        {/* Mode tabs */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap">
          {modes.map(m => (
            <button key={m.id} onClick={() => handleModeChange(m.id)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === m.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter inputs */}
      <AnimatePresence mode="wait">
        {mode !== 'all' && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-end gap-3"
          >
            {mode === 'date' && (
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Select Date</label>
                <input type="date" value={filters.date}
                  onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
            )}
            {mode === 'month' && (
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Select Month</label>
                <input type="month" value={filters.month}
                  onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
            )}
            {mode === 'year' && (
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Select Year</label>
                <select value={filters.year}
                  onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer min-w-[120px]"
                >
                  <option value="">Choose year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
            {mode === 'range' && (
              <>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">From</label>
                  <input type="date" value={filters.from}
                    onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">To</label>
                  <input type="date" value={filters.to}
                    onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pb-0.5">
              <button onClick={onApply} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <IoStatsChartOutline size={14}/>}
                Apply
              </button>
              <button onClick={onClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                <IoCloseOutline size={14}/> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter badge */}
      {(filters.date || filters.month || filters.year || filters.from || filters.to) && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Active filter:</span>
          <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-widest">
            {filters.date  && `Date: ${filters.date}`}
            {filters.month && `Month: ${filters.month}`}
            {filters.year  && `Year: ${filters.year}`}
            {filters.from  && `From: ${filters.from}`}
            {filters.to    && ` → To: ${filters.to}`}
          </span>
        </div>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   CHART CARD WRAPPER
───────────────────────────────────────────── */
const ChartCard = ({ title, subtitle, children, action }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-5 lg:p-7 border-b border-slate-50 flex items-center justify-between gap-4">
      <div>
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="p-5 lg:p-7">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   APPOINTMENT ROW
───────────────────────────────────────────── */
const AppointmentRow = ({ app, onConfirmPayment }) => {
  const statusColor = {
    Pending:   'bg-amber-50 text-amber-600',
    Confirmed: 'bg-blue-50 text-blue-600',
    Completed: 'bg-emerald-50 text-emerald-600',
    Cancelled: 'bg-red-50 text-red-500',
  };
  const statusIcon = {
    Pending:   <IoAlertCircleOutline size={12}/>,
    Confirmed: <IoCheckmarkCircleOutline size={12}/>,
    Completed: <IoCheckmarkCircleOutline size={12}/>,
    Cancelled: <IoCloseCircleOutline size={12}/>,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="px-5 lg:px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-all gap-4">
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${app.payment ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}/>
        {/* Doctor avatar */}
        {app.doctorId?.image ? (
          <img src={app.doctorId.image} alt="" className="w-8 h-8 rounded-xl object-cover flex-shrink-0 hidden sm:block"/>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 hidden sm:block">
            <IoPersonOutline size={14} className="text-blue-500"/>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800 uppercase tracking-tighter truncate">
            {app.userId?.name || 'Guest'}
            <span className="text-slate-300 mx-1.5">→</span>
            {app.doctorId?.name || 'General'}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{app.date} @ {app.slot}</p>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColor[app.status] || 'bg-slate-50 text-slate-500'}`}>
              {statusIcon[app.status]} {app.status}
            </span>
            {app.amount > 0 && (
              <span className="text-[9px] font-black text-slate-400">${app.amount}</span>
            )}
          </div>
        </div>
      </div>
      {!app.payment && app.status !== 'Cancelled' && (
        <button onClick={() => onConfirmPayment(app._id)}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90 flex-shrink-0"
          title="Confirm Payment">
          <IoCheckmarkCircle size={18}/>
        </button>
      )}
      {app.payment && (
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex-shrink-0 hidden sm:block">✓ Paid</span>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    stats: { revenue:0, totalAppointments:0, patients:0, doctors:0, services:0, blogs:0, comments:0, paidAppointments:0, pendingAppointments:0, cancelledAppointments:0, completedAppointments:0, newPatientsThisMonth:0, allTimeRevenue:0 },
    recentActivity: [],
    recentBlogs: [],
    charts: { revenueByMonth:[], revenueByYear:[], appointmentsByDay:[], appointmentsByMonth:[], statusBreakdown:[], topDoctors:[], hourlyDistribution:[] },
    filterApplied: null,
  });
  const [loading, setLoading]           = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeTab, setActiveTab]       = useState('overview'); // 'overview' | 'appointments' | 'revenue' | 'doctors'
  const [chartView, setChartView]       = useState('monthly'); // 'daily' | 'monthly' | 'yearly'
  const [filters, setFilters]           = useState({ date:'', month:'', year:'', from:'', to:'' });

  /* ── Build query string ── */
  const buildQuery = useCallback((f = filters) => {
    const params = new URLSearchParams();
    if (f.date)  params.append('date',  f.date);
    if (f.month) params.append('month', f.month);
    if (f.year)  params.append('year',  f.year);
    if (f.from)  params.append('from',  f.from);
    if (f.to)    params.append('to',    f.to);
    return params.toString();
  }, [filters]);

  /* ── Fetch ── */
  const fetchData = useCallback(async (queryStr = '') => {
    try {
      setLoading(true);
      const url = `${API_BASE}/admin/stats${queryStr ? `?${queryStr}` : ''}`;
      const { data: res } = await axios.get(url, { withCredentials: true });
      if (res.success) {
        setData({
          stats:          res.stats         || {},
          recentActivity: res.recentActivity || [],
          recentBlogs:    res.recentBlogs    || [],
          charts:         res.charts         || {},
          filterApplied:  res.filterApplied  || null,
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast.error('Analytics sync failed.');
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Apply filter ── */
  const handleApplyFilter = () => {
    setFilterLoading(true);
    fetchData(buildQuery());
  };

  /* ── Clear filter ── */
  const handleClearFilter = () => {
    const cleared = { date:'', month:'', year:'', from:'', to:'' };
    setFilters(cleared);
    fetchData('');
  };

  /* ── Confirm payment ── */
  const confirmPayment = async (id) => {
    try {
      const { data: res } = await axios.post(
        `${API_BASE}/appointments/mark-as-paid`,
        { appointmentId: id },
        { withCredentials: true }
      );
      if (res.success) { toast.success('Transaction Verified'); fetchData(buildQuery()); }
    } catch { toast.error('Payment update failed'); }
  };

  /* ── Filtered activity ── */
  const filteredActivity = (data.recentActivity || []).filter(app =>
    app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.slot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Chart data selector ── */
  const revenueChartData = chartView === 'yearly'
    ? data.charts?.revenueByYear?.map(d => ({ ...d, label: String(d.year) }))
    : data.charts?.revenueByMonth?.map(d => ({ ...d, label: d.month?.slice(-5) })) || [];

  const apptChartData = chartView === 'daily'
    ? data.charts?.appointmentsByDay?.map(d => ({ ...d, label: d.date?.slice(-5) }))
    : data.charts?.appointmentsByMonth?.map(d => ({ ...d, label: d.month?.slice(-5) })) || [];

  /* ── Tab config ── */
  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: <IoStatsChartOutline size={15}/> },
    { id: 'appointments',  label: 'Appointments',  icon: <IoCalendarOutline size={15}/> },
    { id: 'revenue',       label: 'Revenue',       icon: <IoWalletOutline size={15}/> },
    { id: 'doctors',       label: 'Top Doctors',   icon: <IoMedicalOutline size={15}/> },
  ];

  /* ── Loading ── */
  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"/>
        <div className="absolute inset-2 border-4 border-blue-50 border-t-blue-300 rounded-full animate-spin" style={{ animationDirection:'reverse', animationDuration:'0.6s' }}/>
      </div>
      <p className="font-black text-[10px] tracking-[0.3em] text-slate-400 uppercase">Parsing Medical Intelligence...</p>
    </div>
  );

  const s = data.stats;

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-[#FBFDFF] min-h-screen">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Analytics Center</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
            {data.filterApplied
              ? `Filtered: ${JSON.stringify(data.filterApplied)}`
              : 'All-time hospital performance data'
            }
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/admin/add-doctor"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
            <IoAddCircleOutline size={16}/> Add Doctor
          </Link>
          <Link to="/admin/post-blog"
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <IoDocumentTextOutline size={16}/> Write Post
          </Link>
          <button onClick={() => fetchData(buildQuery())}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
            <IoRefreshOutline size={16}/>
          </button>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        loading={filterLoading}
      />

      {/* ── TABS ── */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════ */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} className="space-y-6">

            {/* Tier 1: Big stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <StatCard label="Total Revenue"     value={`$${s.revenue?.toLocaleString() || 0}`}    icon={<IoWalletOutline/>}   color="bg-blue-600"    isLive sub={`$${s.allTimeRevenue?.toLocaleString() || 0} all-time`}/>
              <StatCard label="Appointments"      value={s.totalAppointments || 0}                  icon={<IoCalendarOutline/>} color="bg-slate-900"   sub={`${s.paidAppointments || 0} paid · ${s.pendingAppointments || 0} pending`}/>
              <StatCard label="Total Patients"    value={s.patients || 0}                           icon={<IoPeopleOutline/>}   color="bg-emerald-500" sub={`+${s.newPatientsThisMonth || 0} this month`}/>
            </div>

            {/* Tier 2: Mini cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <MiniCard label="Doctors"    value={s.doctors  || 0} icon={<IoMedicalOutline/>}      sub="Active specialists"/>
              <MiniCard label="Services"   value={s.services || 0} icon={<IoLayersOutline/>}/>
              <MiniCard label="Blog Posts" value={s.blogs    || 0} icon={<IoDocumentTextOutline/>} highlight/>
              <MiniCard label="Comments"   value={s.comments || 0} icon={<IoChatbubblesOutline/>}/>
            </div>

            {/* Tier 2b: Appointment breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <MiniCard label="Completed"  value={s.completedAppointments  || 0} icon={<IoCheckmarkCircleOutline size={20}/>} sub="Sessions done"    highlight/>
              <MiniCard label="Confirmed"  value={s.paidAppointments       || 0} icon={<IoCheckmarkCircleOutline size={20}/>} sub="Paid & confirmed"/>
              <MiniCard label="Pending"    value={s.pendingAppointments    || 0} icon={<IoAlertCircleOutline size={20}/>}     sub="Awaiting payment"/>
              <MiniCard label="Cancelled"  value={s.cancelledAppointments  || 0} icon={<IoCloseCircleOutline size={20}/>}     sub="Cancelled"/>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue chart */}
              <ChartCard
                title="Revenue Trend"
                subtitle={chartView === 'yearly' ? 'By Year' : 'Last 12 Months'}
                action={
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {['monthly','yearly'].map(v => (
                      <button key={v} onClick={() => setChartView(v)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartView===v?'bg-white text-blue-600 shadow-sm':'text-slate-400'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">${s.revenue?.toLocaleString() || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {data.filterApplied ? 'Filtered period' : 'Current period'}
                      </p>
                    </div>
                  </div>
                  <MiniBarChart
                    data={revenueChartData}
                    valueKey="revenue"
                    labelKey="label"
                    color="#2563eb"
                    height={100}
                  />
                  {/* X-axis labels */}
                  <div style={{ display:'flex', gap:3 }}>
                    {revenueChartData.slice(-12).map((d,i) => (
                      <div key={i} style={{ flex:1, textAlign:'center', fontSize:7, color:'#94a3b8', fontWeight:700, overflow:'hidden' }}>
                        {d.label || ''}
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>

              {/* Appointments chart */}
              <ChartCard
                title="Appointments"
                subtitle={chartView === 'daily' ? 'Last 30 Days' : 'Last 12 Months'}
                action={
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {['daily','monthly'].map(v => (
                      <button key={v} onClick={() => setChartView(v)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartView===v?'bg-white text-blue-600 shadow-sm':'text-slate-400'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.totalAppointments || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total appointments</p>
                    </div>
                  </div>
                  <MiniBarChart data={apptChartData} valueKey="total" labelKey="label" color="#22c55e" height={100}/>
                  <div style={{ display:'flex', gap:3 }}>
                    {apptChartData.slice(-12).map((d,i) => (
                      <div key={i} style={{ flex:1, textAlign:'center', fontSize:7, color:'#94a3b8', fontWeight:700, overflow:'hidden' }}>
                        {d.label || ''}
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Status donut + top doctors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Appointment Status" subtitle="Breakdown by status">
                {data.charts?.statusBreakdown?.length > 0
                  ? <DonutChart data={data.charts.statusBreakdown} size={130}/>
                  : <p className="text-slate-400 text-xs italic text-center py-8">No data yet.</p>
                }
              </ChartCard>

              <ChartCard title="Peak Hours" subtitle="Appointments by time slot">
                {data.charts?.hourlyDistribution?.length > 0 ? (
                  <div className="space-y-2">
                    {data.charts.hourlyDistribution
                      .filter(h => h.count > 0)
                      .sort((a,b) => b.count - a.count)
                      .slice(0, 6)
                      .map((h, i) => {
                        const maxH = Math.max(...data.charts.hourlyDistribution.map(x => x.count), 1);
                        const label = h.hour < 12 ? `${h.hour}:00 AM` : h.hour === 12 ? `12:00 PM` : `${h.hour-12}:00 PM`;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 w-16 flex-shrink-0">{label}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(h.count / maxH) * 100}%` }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-end pr-2"
                              >
                                <span className="text-[8px] font-black text-white">{h.count}</span>
                              </motion.div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : <p className="text-slate-400 text-xs italic text-center py-8">No slot data yet.</p>}
              </ChartCard>
            </div>

            {/* Operations feed + recent blogs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 lg:p-7 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Live Operations Feed</h3>
                  <div className="relative w-full sm:w-64">
                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
                    <input type="text" placeholder="Search patient, doctor, date..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
                  <AnimatePresence>
                    {filteredActivity.length > 0
                      ? filteredActivity.map(app => (
                          <AppointmentRow key={app._id} app={app} onConfirmPayment={confirmPayment}/>
                        ))
                      : <div className="p-16 text-center text-slate-300 italic text-xs uppercase font-bold">No records found.</div>
                    }
                  </AnimatePresence>
                </div>
              </div>

              {/* Recent blogs */}
              <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 text-white shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black uppercase text-xs tracking-widest">Recent Content</h3>
                  <IoDocumentTextOutline className="text-blue-400 text-2xl"/>
                </div>
                <div className="space-y-6 flex-grow">
                  {data.recentBlogs?.length > 0
                    ? data.recentBlogs.map(blog => (
                        <div key={blog._id} className="group cursor-pointer" onClick={() => navigate(`/blog/${blog._id}`)}>
                          <p className="text-[9px] font-black text-blue-400 uppercase mb-1.5 flex items-center gap-1.5">
                            <IoTimeOutline size={11}/> {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                          <h4 className="text-sm font-bold group-hover:text-blue-300 transition-colors line-clamp-2 uppercase tracking-tight leading-tight">{blog.title}</h4>
                          <div className="w-full h-px bg-white/5 mt-4"/>
                        </div>
                      ))
                    : <p className="text-slate-600 text-[10px] uppercase font-bold italic">No recent posts.</p>
                  }
                </div>
                <Link to="/admin/manage-blogs"
                  className="w-full mt-8 py-3.5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Manage Content <IoArrowForwardOutline/>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════
            APPOINTMENTS TAB
        ════════════════════════════════ */}
        {activeTab === 'appointments' && (
          <motion.div key="appts" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MiniCard label="Total"     value={s.totalAppointments     || 0} icon={<IoCalendarOutline size={20}/>}            highlight/>
              <MiniCard label="Completed" value={s.completedAppointments || 0} icon={<IoCheckmarkCircleOutline size={20}/>}/>
              <MiniCard label="Pending"   value={s.pendingAppointments   || 0} icon={<IoAlertCircleOutline size={20}/>}/>
              <MiniCard label="Cancelled" value={s.cancelledAppointments || 0} icon={<IoCloseCircleOutline size={20}/>}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Daily Appointments" subtitle="Last 30 days">
                <MiniBarChart data={data.charts?.appointmentsByDay?.map(d => ({ ...d, label: d.date?.slice(-5) })) || []} valueKey="total" labelKey="label" color="#2563eb" height={100}/>
              </ChartCard>
              <ChartCard title="Status Breakdown">
                <DonutChart data={data.charts?.statusBreakdown || []} size={130}/>
              </ChartCard>
            </div>

            <ChartCard title="All Appointments" subtitle={`${filteredActivity.length} records`}
              action={
                <div className="relative">
                  <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <input type="text" placeholder="Search..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500 w-48"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              }
            >
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto -mx-5 lg:-mx-7">
                {filteredActivity.length > 0
                  ? filteredActivity.map(app => <AppointmentRow key={app._id} app={app} onConfirmPayment={confirmPayment}/>)
                  : <div className="p-16 text-center text-slate-300 italic text-xs uppercase font-bold">No appointments found.</div>
                }
              </div>
            </ChartCard>
          </motion.div>
        )}

        {/* ════════════════════════════════
            REVENUE TAB
        ════════════════════════════════ */}
        {activeTab === 'revenue' && (
          <motion.div key="revenue" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Period Revenue"   value={`$${s.revenue?.toLocaleString() || 0}`}         icon={<IoWalletOutline/>} color="bg-blue-600"    isLive/>
              <StatCard label="All-Time Revenue" value={`$${s.allTimeRevenue?.toLocaleString() || 0}`}  icon={<IoTrendingUpOutline/>} color="bg-slate-900"/>
              <StatCard label="Paid Sessions"    value={s.paidAppointments || 0}                        icon={<IoCheckmarkCircleOutline/>} color="bg-emerald-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Monthly Revenue" subtitle="Last 12 months">
                <div className="space-y-3">
                  <MiniBarChart
                    data={data.charts?.revenueByMonth?.map(d => ({ ...d, label: d.month?.slice(-5) })) || []}
                    valueKey="revenue" labelKey="label" color="#2563eb" height={120}
                  />
                  {/* Table */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...(data.charts?.revenueByMonth || [])].reverse().map((row, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-[10px] font-bold text-slate-500">{row.month}</span>
                        <span className="text-[10px] font-bold text-slate-400">{row.count} appts</span>
                        <span className="text-sm font-black text-slate-900">${row.revenue?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Yearly Revenue" subtitle="All years">
                <div className="space-y-3">
                  <MiniBarChart
                    data={data.charts?.revenueByYear?.map(d => ({ ...d, label: String(d.year) })) || []}
                    valueKey="revenue" labelKey="label" color="#f59e0b" height={120}
                  />
                  <div className="space-y-2">
                    {[...(data.charts?.revenueByYear || [])].reverse().map((row, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <span className="text-[10px] font-bold text-slate-500">{row.year}</span>
                        <span className="text-[10px] font-bold text-slate-400">{row.count} paid sessions</span>
                        <span className="text-sm font-black text-slate-900">${row.revenue?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════
            TOP DOCTORS TAB
        ════════════════════════════════ */}
        {activeTab === 'doctors' && (
          <motion.div key="doctors" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} className="space-y-6">
            <ChartCard title="Top Doctors by Sessions" subtitle="Ranked by appointment volume">
              {data.charts?.topDoctors?.length > 0 ? (
                <div className="space-y-4">
                  {data.charts.topDoctors.map((doc, i) => {
                    const maxS = Math.max(...data.charts.topDoctors.map(d => d.sessions), 1);
                    return (
                      <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.07 }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                        <span className="text-lg font-black text-slate-300 w-6 flex-shrink-0">#{i+1}</span>
                        {doc.image
                          ? <img src={doc.image} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                          : <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><IoPersonOutline size={18} className="text-blue-500"/></div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate">{doc.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(doc.sessions / maxS) * 100}%` }}
                                transition={{ delay: i * 0.07, duration: 0.6 }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 flex-shrink-0">{doc.sessions} sessions</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-slate-900 text-sm">${doc.revenue?.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Revenue</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic text-center py-12">No session data yet.</p>
              )}
            </ChartCard>

            {/* Hourly distribution */}
            <ChartCard title="Appointment Distribution by Hour" subtitle="When patients book most">
              <div className="space-y-2">
                {data.charts?.hourlyDistribution?.filter(h => h.count > 0).sort((a,b) => b.count - a.count).map((h, i) => {
                  const maxH = Math.max(...(data.charts.hourlyDistribution || []).map(x => x.count), 1);
                  const label = h.hour === 0 ? '12:00 AM' : h.hour < 12 ? `${h.hour}:00 AM` : h.hour === 12 ? '12:00 PM' : `${h.hour-12}:00 PM`;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 w-20 flex-shrink-0">{label}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(h.count / maxH) * 100}%` }}
                          transition={{ delay: i * 0.04, duration: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-end pr-2"
                        >
                          <span className="text-[8px] font-black text-white">{h.count}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
                {!data.charts?.hourlyDistribution?.some(h => h.count > 0) && (
                  <p className="text-slate-400 text-xs italic text-center py-8">No slot data yet.</p>
                )}
              </div>
            </ChartCard>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;