import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiGrid, FiUsers, FiBriefcase, FiCheckSquare, FiFileText,
  FiLogOut, FiBell, FiSearch,
  FiSun, FiMoon, FiMenu, FiX, FiTrendingUp, FiTrendingDown,
  FiPlus, FiTrash2, FiChevronRight, FiChevronLeft,
  FiCpu, FiActivity, FiDollarSign,
  FiUser, FiMail, FiCalendar,
  FiCheck, FiRefreshCw,
  FiSend, FiZap, FiAward
} from 'react-icons/fi';
import api from './services/api';
import { AskOpsly } from './components/AskOpsly';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer, toast } from './components/Toast';
import './styles.css';

// ── Utility helpers ────────────────────────────────────────
const fmt = (n) => `$${Number(n).toLocaleString()}`;
const fmtDate = (s) => s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtShort = (s) => s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
const statusColor = (s) => {
  const map = {
    'Active': 'success', 'Completed': 'success', 'Paid': 'success',
    'Lead': 'info', 'In Progress': 'info', 'Planning': 'info',
    'Review': 'warning', 'Pending': 'warning', 'Delayed': 'warning',
    'Inactive': 'muted', 'Todo': 'muted', 'Draft': 'muted',
    'At Risk': 'danger', 'Overdue': 'danger',
    'High': 'danger', 'Medium': 'warning', 'Low': 'success',
  };
  return map[s] || 'muted';
};
const priorityIcon = (p) => {
  if (p === 'High') return <span style={{ color: 'var(--opsly-danger)' }}>●</span>;
  if (p === 'Medium') return <span style={{ color: 'var(--opsly-warning)' }}>●</span>;
  return <span style={{ color: 'var(--opsly-success)' }}>●</span>;
};

// ── Mini Sparkline SVG chart ───────────────────────────────
function Sparkline({ data = [], color = 'var(--opsly-accent)', height = 40, width = 100 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Donut Chart SVG ───────────────────────────────────────
function DonutChart({ segments = [] }) {
  const r = 40, cx = 50, cy = 50;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let angle = -90;
  const arcs = segments.map((seg) => {
    const pct = (seg.value / total) * 360;
    const start = angle;
    angle += pct;
    const toRad = (d) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(start + pct));
    const y2 = cy + r * Math.sin(toRad(start + pct));
    const large = pct > 180 ? 1 : 0;
    return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg viewBox="0 0 100 100" width="100" height="100">
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} opacity="0.9" />)}
      <circle cx={cx} cy={cy} r="26" fill="var(--opsly-card-bg)" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fill="var(--opsly-text)" fontWeight="700">{total}</text>
    </svg>
  );
}

// ── Bar Chart SVG ─────────────────────────────────────────
function BarChart({ data = [], labels = [] }) {
  const max = Math.max(...data, 1);
  const barW = 24, gap = 12, h = 120, pad = 8;
  const total = data.length;
  const svgW = total * (barW + gap) + gap;
  return (
    <svg width="100%" height={h + 24} viewBox={`0 0 ${svgW} ${h + 24}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * h);
        const x = gap + i * (barW + gap);
        const y = h - bh + pad;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="4" fill="var(--opsly-accent)" opacity={i === data.length - 1 ? 1 : 0.5} />
            {labels[i] && <text x={x + barW / 2} y={h + 20} textAnchor="middle" fontSize="9" fill="var(--opsly-text-muted)">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── Login Page ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const roles = [
    { role: 'Admin', email: 'alex@opsly.com', desc: 'Full access — manage everything' },
    { role: 'Manager', email: 'sarah@opsly.com', desc: 'Projects, tasks & team oversight' },
    { role: 'Developer', email: 'mike@opsly.com', desc: 'View projects and own tasks' },
  ];

  const handleLogin = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const found = roles.find(r => r.role === selectedRole);
      const res = await api.login(found.email, found.role);
      localStorage.setItem('opsly_token', res.token);
      onLogin(res.user);
    } catch (e) {
      toast('Login failed: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="opsly-login-page">
      <div className="opsly-login-box">
        <div className="opsly-login-header">
          <div className="opsly-logo" style={{ fontSize: 28 }}>
            Ops<span>ly</span>
          </div>
          <p style={{ margin: 0, color: 'var(--opsly-text-muted)', fontSize: 13 }}>
            Operations Intelligence Platform
          </p>
        </div>

        <div>
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Select your role to continue</p>
          <div className="opsly-role-select-grid">
            {roles.map(r => (
              <button
                key={r.role}
                className={`opsly-role-option-btn ${selectedRole === r.role ? 'selected' : ''}`}
                onClick={() => setSelectedRole(r.role)}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--opsly-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--opsly-accent)', flexShrink: 0 }}>
                  <FiUser size={16} />
                </div>
                <div className="opsly-role-option-info">
                  <span className="opsly-role-option-name">{r.role}</span>
                  <span className="opsly-role-option-desc">{r.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          className="opsly-btn opsly-btn-primary"
          style={{ width: '100%', padding: '12px' }}
          disabled={!selectedRole || loading}
          onClick={handleLogin}
        >
          {loading ? 'Signing in...' : 'Enter Dashboard'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--opsly-text-muted)', margin: 0 }}>
          Opsly — Portfolio concept by <strong>Craftivo</strong>. No real data.
        </p>
      </div>
    </div>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────
function Skeleton({ type = 'text' }) {
  return <div className={`skeleton skeleton-${type}`} />;
}

// ── KPI Card ───────────────────────────────────────────────
function KpiCard({ label, value, trend, trendLabel, sparkData, icon: Icon, iconColor }) {
  return (
    <div className="opsly-card opsly-kpi-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="opsly-kpi-label">{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
          <Icon size={16} />
        </div>
      </div>
      <div className="opsly-kpi-value">{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div className={`opsly-kpi-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
          {trend > 0 ? <FiTrendingUp size={13} /> : trend < 0 ? <FiTrendingDown size={13} /> : null}
          {trendLabel}
        </div>
        {sparkData && <Sparkline data={sparkData} color={trend > 0 ? 'var(--opsly-success)' : 'var(--opsly-danger)'} />}
      </div>
    </div>
  );
}

// ── Dashboard View ─────────────────────────────────────────
function DashboardView({ customers, projects, tasks, invoices, activities }) {
  const totalRevenue = customers.reduce((s, c) => s + (c.revenue || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const atRisk = projects.filter(p => p.status === 'At Risk' || p.status === 'Delayed').length;
  const openTasks = tasks.filter(t => t.status !== 'Completed').length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;

  const recentActivities = activities.slice(0, 8);
  const atRiskProjects = projects.filter(p => p.status === 'At Risk' || p.status === 'Delayed').slice(0, 5);
  const topCustomers = [...customers].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const taskStatusCounts = [
    { label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length },
    { label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { label: 'Todo', count: tasks.filter(t => t.status === 'Todo').length },
  ];

  const sparkRevenue = [42, 51, 48, 60, 58, 72, 68, 80, 75, 91, 87, 100];
  const sparkTasks = [8, 12, 10, 15, 11, 14, 18, 16, 20, 17, 22, openTasks];
  const invoiceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const invoiceData = [18000, 24000, 22000, 31000, 28000, 35000];

  return (
    <>
      <div className="opsly-kpi-grid">
        <KpiCard label="Total Revenue" value={fmt(totalRevenue)} trend={1} trendLabel="+12% this month" sparkData={sparkRevenue} icon={FiDollarSign} iconColor="var(--opsly-accent)" />
        <KpiCard label="Active Projects" value={activeProjects} trend={0} trendLabel={`${atRisk} at risk`} icon={FiBriefcase} iconColor="var(--opsly-info)" />
        <KpiCard label="Open Tasks" value={openTasks} trend={-1} trendLabel="−5 since last week" sparkData={sparkTasks} icon={FiCheckSquare} iconColor="var(--opsly-warning)" />
        <KpiCard label="Invoiced (Paid)" value={fmt(paidInvoices)} trend={1} trendLabel={`${overdueInvoices} overdue`} icon={FiFileText} iconColor="var(--opsly-success)" />
      </div>

      <div className="opsly-dashboard-row">
        <div className="opsly-card">
          <div className="opsly-card-header">
            <h3 className="opsly-card-title">Revenue Overview</h3>
            <span className="opsly-badge opsly-badge-success">+18% YTD</span>
          </div>
          <BarChart data={invoiceData} labels={invoiceMonths} />
          <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--opsly-border-light)', fontSize: 12 }}>
            {[
              { l: 'Total Invoiced', v: fmt(invoices.reduce((s, i) => s + i.amount, 0)) },
              { l: 'Collected', v: fmt(paidInvoices) },
              { l: 'Outstanding', v: fmt(invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0)) },
            ].map(it => (
              <div key={it.l}>
                <div style={{ color: 'var(--opsly-text-muted)', marginBottom: 2 }}>{it.l}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="opsly-card">
          <div className="opsly-card-header">
            <h3 className="opsly-card-title">Recent Activity</h3>
            <FiActivity size={14} color="var(--opsly-text-muted)" />
          </div>
          <div className="opsly-timeline" style={{ maxHeight: 280, overflowY: 'auto' }}>
            {recentActivities.map(a => (
              <div key={a.id} className="opsly-timeline-item">
                <div className="opsly-timeline-icon">
                  {a.type === 'Customer' ? <FiUsers size={12} /> :
                   a.type === 'Project' ? <FiBriefcase size={12} /> :
                   a.type === 'Task' ? <FiCheckSquare size={12} /> :
                   a.type === 'Invoice' ? <FiFileText size={12} /> : <FiZap size={12} />}
                </div>
                <div className="opsly-timeline-content">
                  <p className="opsly-timeline-text">{a.description}</p>
                  <span className="opsly-timeline-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="opsly-dashboard-row-equal">
        <div className="opsly-card">
          <div className="opsly-card-header">
            <h3 className="opsly-card-title">Projects Needing Attention</h3>
            <span className="opsly-badge opsly-badge-danger">{atRisk} at risk</span>
          </div>
          {atRiskProjects.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--opsly-text-muted)', padding: '24px 0' }}>
              <FiAward size={28} style={{ marginBottom: 8 }} /><br />All projects on track!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {atRiskProjects.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                    <div className="opsly-project-progress-bar-container">
                      <div className="opsly-project-progress-bar" style={{ width: `${p.progress}%`, backgroundColor: p.status === 'At Risk' ? 'var(--opsly-danger)' : 'var(--opsly-warning)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4, color: 'var(--opsly-text-muted)' }}>
                      <span>{p.progress}% complete</span>
                      <span>Due {fmtShort(p.deadline)}</span>
                    </div>
                  </div>
                  <span className={`opsly-badge opsly-badge-${statusColor(p.status)}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="opsly-card">
          <div className="opsly-card-header">
            <h3 className="opsly-card-title">Top Customers by Revenue</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topCustomers.map((c, i) => {
              const maxRev = topCustomers[0].revenue;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--opsly-text-muted)', width: 16 }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                      <span style={{ fontWeight: 700, fontSize: 12 }}>{fmt(c.revenue)}</span>
                    </div>
                    <div className="opsly-project-progress-bar-container">
                      <div className="opsly-project-progress-bar" style={{ width: `${(c.revenue / maxRev) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="opsly-card">
        <div className="opsly-card-header">
          <h3 className="opsly-card-title">Task Distribution</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <DonutChart segments={[
            { value: taskStatusCounts[0].count || 1, color: 'var(--opsly-success)' },
            { value: taskStatusCounts[1].count || 1, color: 'var(--opsly-warning)' },
            { value: taskStatusCounts[2].count || 1, color: 'var(--opsly-border)' },
          ]} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {taskStatusCounts.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: i === 0 ? 'var(--opsly-success)' : i === 1 ? 'var(--opsly-warning)' : 'var(--opsly-border)' }} />
                <span style={{ fontSize: 13 }}>{s.label}</span>
                <span style={{ fontWeight: 700, marginLeft: 'auto', paddingLeft: 24 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Customers View ─────────────────────────────────────────
function CustomersView({ customers, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', location: '', status: 'Lead' });
  const [saving, setSaving] = useState(false);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const match = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const filt = filter === 'All' || c.status === filter;
    return match && filt;
  });

  const handleAdd = async () => {
    if (!form.name || !form.company || !form.email) return toast('Please fill required fields', 'error');
    setSaving(true);
    try {
      await api.createCustomer({ ...form, managerId: 'u1', revenue: 0 });
      toast('Customer added successfully', 'success');
      setShowAdd(false);
      setForm({ name: '', company: '', email: '', phone: '', location: '', status: 'Lead' });
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name}?`)) return;
    try {
      await api.deleteCustomer(id);
      toast('Customer removed', 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">CRM</span>
          <h1 className="opsly-page-title">Customers</h1>
          <p className="opsly-page-subtitle">{customers.length} total accounts managed</p>
        </div>
        <button className="opsly-btn opsly-btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus size={14} /> Add Customer
        </button>
      </div>

      <div className="opsly-card">
        <div className="opsly-filters-bar" style={{ marginBottom: 16 }}>
          <div className="opsly-search-input-wrapper">
            <FiSearch size={14} color="var(--opsly-text-muted)" />
            <input className="opsly-search-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Active', 'Lead', 'Inactive'].map(f => (
              <button key={f} className={`opsly-btn ${filter === f ? 'opsly-btn-primary' : 'opsly-btn-secondary'}`} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="opsly-table-wrapper">
          <table className="opsly-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Location</th>
                <th>Revenue</th>
                <th>Last Activity</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={6}><Skeleton type="text" /></td></tr>
              )) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--opsly-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {c.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--opsly-text-muted)' }}>{c.company}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`opsly-badge opsly-badge-${statusColor(c.status)}`}>{c.status}</span></td>
                  <td style={{ color: 'var(--opsly-text-muted)' }}>{c.location || '—'}</td>
                  <td><strong>{fmt(c.revenue)}</strong></td>
                  <td style={{ color: 'var(--opsly-text-muted)', fontSize: 12 }}>{c.lastActivity || '—'}</td>
                  <td>
                    <button className="opsly-header-icon-btn" title="Delete" onClick={() => handleDelete(c.id, c.name)}><FiTrash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--opsly-text-muted)', padding: 40 }}>No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="opsly-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="opsly-modal" onClick={e => e.stopPropagation()}>
            <div className="opsly-modal-header">
              <h3 className="opsly-modal-title">Add New Customer</h3>
              <button className="opsly-header-icon-btn" onClick={() => setShowAdd(false)}><FiX size={18} /></button>
            </div>
            <div className="opsly-modal-body">
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'John Smith' },
                { label: 'Company *', key: 'company', placeholder: 'Acme Inc.' },
                { label: 'Email *', key: 'email', placeholder: 'john@acme.com' },
                { label: 'Phone', key: 'phone', placeholder: '+1 (555) 000-0000' },
                { label: 'Location', key: 'location', placeholder: 'New York, NY' },
              ].map(f => (
                <div key={f.key} className="opsly-form-group">
                  <label className="opsly-form-label">{f.label}</label>
                  <input className="opsly-form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="opsly-form-group">
                <label className="opsly-form-label">Status</label>
                <select className="opsly-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['Lead', 'Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="opsly-modal-footer">
              <button className="opsly-btn opsly-btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="opsly-btn opsly-btn-primary" disabled={saving} onClick={handleAdd}>{saving ? 'Saving...' : 'Add Customer'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Projects View ──────────────────────────────────────────
function ProjectsView({ projects, customers, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', clientId: '', status: 'Planning', budget: '', deadline: '' });
  const [saving, setSaving] = useState(false);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const match = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const filt = filter === 'All' || p.status === filter;
    return match && filt;
  });

  const getClient = (id) => customers.find(c => c.id === id);

  const handleAdd = async () => {
    if (!form.name || !form.clientId) return toast('Name and client required', 'error');
    setSaving(true);
    try {
      await api.createProject({ ...form, budget: parseFloat(form.budget) || 0, progress: 0, ownerId: 'u1' });
      toast('Project created!', 'success');
      setShowAdd(false);
      setForm({ name: '', description: '', clientId: '', status: 'Planning', budget: '', deadline: '' });
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete project "${name}"?`)) return;
    try {
      await api.deleteProject(id);
      toast('Project deleted', 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  const statusFilters = ['All', 'Planning', 'In Progress', 'Review', 'At Risk', 'Completed'];

  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">Work</span>
          <h1 className="opsly-page-title">Projects</h1>
          <p className="opsly-page-subtitle">{projects.length} projects total · {projects.filter(p => p.status === 'In Progress').length} active</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="opsly-btn opsly-btn-secondary" style={{ padding: '8px' }} onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <FiCheckSquare size={14} /> : <FiGrid size={14} />}
          </button>
          <button className="opsly-btn opsly-btn-primary" onClick={() => setShowAdd(true)}>
            <FiPlus size={14} /> New Project
          </button>
        </div>
      </div>

      <div className="opsly-filters-bar">
        <div className="opsly-search-input-wrapper">
          <FiSearch size={14} color="var(--opsly-text-muted)" />
          <input className="opsly-search-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {statusFilters.map(f => (
            <button key={f} className={`opsly-btn ${filter === f ? 'opsly-btn-primary' : 'opsly-btn-secondary'}`} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="opsly-grid-3">
          {loading ? Array(6).fill(0).map((_, i) => (
            <div key={i} className="opsly-card"><Skeleton type="title" /><Skeleton type="text" /><Skeleton type="text" /></div>
          )) : filtered.map(p => {
            const client = getClient(p.clientId);
            return (
              <div key={p.id} className="opsly-card opsly-project-grid-card">
                <div className="opsly-project-grid-card-header">
                  <div>
                    <span className={`opsly-badge opsly-badge-${statusColor(p.status)}`} style={{ marginBottom: 8, display: 'inline-flex' }}>{p.status}</span>
                    <h3 className="opsly-project-grid-title">{p.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--opsly-text-muted)', margin: '4px 0 0 0' }}>{p.description}</p>
                  </div>
                  <button className="opsly-header-icon-btn" onClick={() => handleDelete(p.id, p.name)}><FiTrash2 size={13} /></button>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--opsly-text-muted)', marginBottom: 6 }}>
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
                  <div className="opsly-project-progress-bar-container">
                    <div className="opsly-project-progress-bar" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <div className="opsly-project-grid-meta">
                  <span>{client ? client.name : '—'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCalendar size={11} /> {fmtShort(p.deadline)}</span>
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--opsly-text-muted)', padding: 40 }}>No projects found.</div>
          )}
        </div>
      ) : (
        <div className="opsly-card">
          <div className="opsly-table-wrapper">
            <table className="opsly-table">
              <thead>
                <tr>
                  <th>Project</th><th>Client</th><th>Status</th><th>Progress</th><th>Budget</th><th>Deadline</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const client = getClient(p.clientId);
                  return (
                    <tr key={p.id}>
                      <td><div style={{ fontWeight: 600 }}>{p.name}</div></td>
                      <td>{client?.name || '—'}</td>
                      <td><span className={`opsly-badge opsly-badge-${statusColor(p.status)}`}>{p.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="opsly-project-progress-bar-container" style={{ width: 80 }}>
                            <div className="opsly-project-progress-bar" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--opsly-text-muted)' }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td>{fmt(p.budget)}</td>
                      <td style={{ fontSize: 12, color: 'var(--opsly-text-muted)' }}>{fmtDate(p.deadline)}</td>
                      <td><button className="opsly-header-icon-btn" onClick={() => handleDelete(p.id, p.name)}><FiTrash2 size={13} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="opsly-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="opsly-modal" onClick={e => e.stopPropagation()}>
            <div className="opsly-modal-header">
              <h3 className="opsly-modal-title">New Project</h3>
              <button className="opsly-header-icon-btn" onClick={() => setShowAdd(false)}><FiX size={18} /></button>
            </div>
            <div className="opsly-modal-body">
              <div className="opsly-form-group">
                <label className="opsly-form-label">Project Name *</label>
                <input className="opsly-form-input" placeholder="e.g. Brand Refresh" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Description</label>
                <textarea className="opsly-form-textarea" placeholder="Brief description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Client *</label>
                <select className="opsly-form-select" value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                  <option value="">— Select client —</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Budget ($)</label>
                  <input className="opsly-form-input" type="number" placeholder="15000" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
                </div>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Deadline</label>
                  <input className="opsly-form-input" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                </div>
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Status</label>
                <select className="opsly-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['Planning', 'In Progress', 'Review', 'Completed', 'At Risk'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="opsly-modal-footer">
              <button className="opsly-btn opsly-btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="opsly-btn opsly-btn-primary" disabled={saving} onClick={handleAdd}>{saving ? 'Creating...' : 'Create Project'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Tasks View ─────────────────────────────────────────────
function TasksView({ tasks, projects, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', projectId: '', priority: 'Medium', dueDate: '' });
  const [saving, setSaving] = useState(false);

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const match = !q || t.name.toLowerCase().includes(q);
    const filt = filter === 'All' || t.status === filter;
    const pFilt = priorityFilter === 'All' || t.priority === priorityFilter;
    return match && filt && pFilt;
  });

  const getProject = (id) => projects.find(p => p.id === id);

  const handleToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    try {
      await api.updateTask(task.id, { ...task, status: newStatus });
      toast(newStatus === 'Completed' ? 'Task completed! ✓' : 'Task reopened', 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  const handleAdd = async () => {
    if (!form.name || !form.projectId) return toast('Name and project required', 'error');
    setSaving(true);
    try {
      await api.createTask({ ...form, status: 'Todo', assigneeId: 'u1' });
      toast('Task created!', 'success');
      setShowAdd(false);
      setForm({ name: '', projectId: '', priority: 'Medium', dueDate: '' });
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      toast('Task deleted', 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">Execution</span>
          <h1 className="opsly-page-title">Tasks</h1>
          <p className="opsly-page-subtitle">
            {tasks.filter(t => t.status === 'Completed').length} of {tasks.length} completed
          </p>
        </div>
        <button className="opsly-btn opsly-btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus size={14} /> Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { label: 'Todo', count: tasks.filter(t => t.status === 'Todo').length, color: 'var(--opsly-text-muted)' },
          { label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length, color: 'var(--opsly-warning)' },
          { label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length, color: 'var(--opsly-success)' },
        ].map(s => (
          <div key={s.label} className="opsly-card" style={{ padding: 16, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 12, color: 'var(--opsly-text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="opsly-card">
        <div className="opsly-filters-bar" style={{ marginBottom: 16 }}>
          <div className="opsly-search-input-wrapper">
            <FiSearch size={14} color="var(--opsly-text-muted)" />
            <input className="opsly-search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Todo', 'In Progress', 'Completed'].map(f => (
              <button key={f} className={`opsly-btn ${filter === f ? 'opsly-btn-primary' : 'opsly-btn-secondary'}`} style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>
            ))}
            <select className="opsly-filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option>All</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>

        <div className="opsly-task-list">
          {loading ? Array(6).fill(0).map((_, i) => <Skeleton key={i} type="text" />) :
           filtered.map(t => {
            const project = getProject(t.projectId);
            return (
              <div key={t.id} className={`opsly-task-item ${t.status === 'Completed' ? 'completed' : ''}`}>
                <div className="opsly-task-item-left">
                  <div
                    className={`opsly-task-checkbox ${t.status === 'Completed' ? 'checked' : ''}`}
                    onClick={() => handleToggle(t)}
                    role="checkbox"
                    tabIndex={0}
                  >
                    {t.status === 'Completed' && <FiCheck size={11} />}
                  </div>
                  <div>
                    <p className="opsly-task-name">{t.name}</p>
                    <div className="opsly-task-meta">
                      <span>{priorityIcon(t.priority)} {t.priority}</span>
                      {project && <span><FiBriefcase size={10} /> {project.name}</span>}
                      {t.dueDate && <span><FiCalendar size={10} /> {fmtShort(t.dueDate)}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`opsly-badge opsly-badge-${statusColor(t.status)}`}>{t.status}</span>
                  <button className="opsly-header-icon-btn" title="Delete task" onClick={() => handleDelete(t.id)}><FiTrash2 size={13} /></button>
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--opsly-text-muted)', padding: '32px 0' }}>No tasks found.</div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="opsly-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="opsly-modal" onClick={e => e.stopPropagation()}>
            <div className="opsly-modal-header">
              <h3 className="opsly-modal-title">Add Task</h3>
              <button className="opsly-header-icon-btn" onClick={() => setShowAdd(false)}><FiX size={18} /></button>
            </div>
            <div className="opsly-modal-body">
              <div className="opsly-form-group">
                <label className="opsly-form-label">Task Name *</label>
                <input className="opsly-form-input" placeholder="e.g. Design homepage wireframes" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Project *</label>
                <select className="opsly-form-select" value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))}>
                  <option value="">— Select project —</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Priority</label>
                  <select className="opsly-form-select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                    {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Due Date</label>
                  <input className="opsly-form-input" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="opsly-modal-footer">
              <button className="opsly-btn opsly-btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="opsly-btn opsly-btn-primary" disabled={saving} onClick={handleAdd}>{saving ? 'Saving...' : 'Add Task'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Invoices View ──────────────────────────────────────────
function InvoicesView({ invoices, customers, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ clientId: '', description: '', amount: '', dueDate: '', status: 'Draft' });
  const [saving, setSaving] = useState(false);

  const filtered = invoices.filter(i => {
    const q = search.toLowerCase();
    const match = !q || i.invoiceNumber.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
    const filt = filter === 'All' || i.status === filter;
    return match && filt;
  });

  const getClient = (id) => customers.find(c => c.id === id);

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const totalDraft = invoices.filter(i => i.status === 'Draft').reduce((s, i) => s + i.amount, 0);

  const handleStatusChange = async (inv, newStatus) => {
    try {
      await api.updateInvoiceStatus(inv.id, newStatus);
      toast(`Invoice marked as ${newStatus}`, 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  const handleAdd = async () => {
    if (!form.clientId || !form.amount) return toast('Client and amount required', 'error');
    setSaving(true);
    try {
      await api.createInvoice({ ...form, amount: parseFloat(form.amount), issueDate: new Date().toISOString() });
      toast('Invoice created!', 'success');
      setShowAdd(false);
      setForm({ clientId: '', description: '', amount: '', dueDate: '', status: 'Draft' });
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">Finance</span>
          <h1 className="opsly-page-title">Invoices</h1>
          <p className="opsly-page-subtitle">{invoices.length} invoices · {fmt(totalPaid + totalPending + totalOverdue + totalDraft)} total</p>
        </div>
        <button className="opsly-btn opsly-btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus size={14} /> New Invoice
        </button>
      </div>

      <div className="opsly-invoices-stats-grid">
        {[
          { label: 'Paid', value: fmt(totalPaid), count: invoices.filter(i => i.status === 'Paid').length, color: 'var(--opsly-success)' },
          { label: 'Pending', value: fmt(totalPending), count: invoices.filter(i => i.status === 'Pending').length, color: 'var(--opsly-warning)' },
          { label: 'Overdue', value: fmt(totalOverdue), count: invoices.filter(i => i.status === 'Overdue').length, color: 'var(--opsly-danger)' },
          { label: 'Draft', value: fmt(totalDraft), count: invoices.filter(i => i.status === 'Draft').length, color: 'var(--opsly-text-muted)' },
        ].map(s => (
          <div key={s.label} className="opsly-card" style={{ padding: 20, borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, color: 'var(--opsly-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: s.color, fontWeight: 600 }}>{s.count} invoice{s.count !== 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      <div className="opsly-card">
        <div className="opsly-filters-bar" style={{ marginBottom: 16 }}>
          <div className="opsly-search-input-wrapper">
            <FiSearch size={14} color="var(--opsly-text-muted)" />
            <input className="opsly-search-input" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map(f => (
              <button key={f} className={`opsly-btn ${filter === f ? 'opsly-btn-primary' : 'opsly-btn-secondary'}`} style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="opsly-table-wrapper">
          <table className="opsly-table">
            <thead>
              <tr>
                <th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th><th>Issue Date</th><th>Due Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={7}><Skeleton type="text" /></td></tr>
              )) : filtered.map(inv => {
                const client = getClient(inv.clientId);
                return (
                  <tr key={inv.id}>
                    <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{inv.invoiceNumber}</strong></td>
                    <td>{client?.name || '—'}<div style={{ fontSize: 11, color: 'var(--opsly-text-muted)' }}>{client?.company}</div></td>
                    <td><strong>{fmt(inv.amount)}</strong></td>
                    <td><span className={`opsly-badge opsly-badge-${statusColor(inv.status)}`}>{inv.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--opsly-text-muted)' }}>{fmtDate(inv.issueDate)}</td>
                    <td style={{ fontSize: 12, color: inv.status === 'Overdue' ? 'var(--opsly-danger)' : 'var(--opsly-text-muted)' }}>{fmtDate(inv.dueDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {inv.status !== 'Paid' && (
                          <button className="opsly-btn opsly-btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleStatusChange(inv, 'Paid')}>
                            <FiCheck size={11} /> Paid
                          </button>
                        )}
                        {inv.status === 'Draft' && (
                          <button className="opsly-btn opsly-btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleStatusChange(inv, 'Pending')}>
                            Send
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--opsly-text-muted)', padding: 40 }}>No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="opsly-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="opsly-modal" onClick={e => e.stopPropagation()}>
            <div className="opsly-modal-header">
              <h3 className="opsly-modal-title">New Invoice</h3>
              <button className="opsly-header-icon-btn" onClick={() => setShowAdd(false)}><FiX size={18} /></button>
            </div>
            <div className="opsly-modal-body">
              <div className="opsly-form-group">
                <label className="opsly-form-label">Client *</label>
                <select className="opsly-form-select" value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                  <option value="">— Select client —</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                </select>
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Description</label>
                <textarea className="opsly-form-textarea" placeholder="Services rendered..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Amount ($) *</label>
                  <input className="opsly-form-input" type="number" placeholder="5000" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div className="opsly-form-group">
                  <label className="opsly-form-label">Due Date</label>
                  <input className="opsly-form-input" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="opsly-form-group">
                <label className="opsly-form-label">Status</label>
                <select className="opsly-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['Draft', 'Pending', 'Paid'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="opsly-modal-footer">
              <button className="opsly-btn opsly-btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="opsly-btn opsly-btn-primary" disabled={saving} onClick={handleAdd}>{saving ? 'Creating...' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Team View ──────────────────────────────────────────────
const TEAM = [
  { id: 'u1', name: 'Alex Rivera', role: 'Admin', email: 'alex@opsly.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', tasks: 8, projects: 5 },
  { id: 'u2', name: 'Sarah Chen', role: 'Manager', email: 'sarah@opsly.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', tasks: 12, projects: 7 },
  { id: 'u3', name: 'Mike Ross', role: 'Developer', email: 'mike@opsly.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', tasks: 19, projects: 4 },
  { id: 'u4', name: 'Emily Taylor', role: 'Designer', email: 'emily@opsly.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', tasks: 14, projects: 6 },
  { id: 'u5', name: 'David Kim', role: 'Sales', email: 'david@opsly.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', tasks: 6, projects: 3 },
];

function TeamView() {
  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">People</span>
          <h1 className="opsly-page-title">Team</h1>
          <p className="opsly-page-subtitle">{TEAM.length} members across all roles</p>
        </div>
        <button className="opsly-btn opsly-btn-secondary" onClick={() => toast('Invite sent! (demo)', 'info')}>
          <FiPlus size={14} /> Invite Member
        </button>
      </div>

      <div className="opsly-team-grid">
        {TEAM.map(member => (
          <div key={member.id} className="opsly-card opsly-member-card">
            <img
              src={member.avatar}
              alt={member.name}
              className="opsly-member-avatar"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <h3 className="opsly-member-name">{member.name}</h3>
              <div style={{ marginTop: 4 }}>
                <span className="opsly-member-role">{member.role}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--opsly-text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiMail size={11} /> {member.email}
              </div>
            </div>
            <div className="opsly-member-stats">
              <div className="opsly-member-stat-item">
                <span className="opsly-member-stat-val">{member.tasks}</span>
                <span className="opsly-member-stat-label">Tasks</span>
              </div>
              <div className="opsly-member-stat-item">
                <span className="opsly-member-stat-val">{member.projects}</span>
                <span className="opsly-member-stat-label">Projects</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Ask AI View ────────────────────────────────────────────
function AskAIView() {
  return (
    <>
      <div className="opsly-page-header">
        <div className="opsly-page-title-area">
          <span className="opsly-page-kicker">Intelligence</span>
          <h1 className="opsly-page-title">Ask Opsly AI</h1>
          <p className="opsly-page-subtitle">Ask natural language questions about your business operations</p>
        </div>
        <span className="opsly-badge opsly-badge-info" style={{ padding: '6px 14px', fontSize: 12 }}>
          <FiCpu size={13} style={{ marginRight: 4 }} /> AI Ready
        </span>
      </div>
      <div style={{ maxWidth: 720 }}>
        <AskOpsly />
        <div className="opsly-card" style={{ marginTop: 20 }}>
          <h3 className="opsly-card-title" style={{ marginBottom: 16 }}>What you can ask</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: FiUsers, label: 'Customers', examples: ['Which customers generated the most revenue?', 'Who are our active leads?'] },
              { icon: FiBriefcase, label: 'Projects', examples: ['Which projects are at risk?', 'What is our overall project progress?'] },
              { icon: FiCheckSquare, label: 'Tasks', examples: ['Who has the most overdue tasks?', 'What high-priority tasks are pending?'] },
              { icon: FiFileText, label: 'Finance', examples: ['What is our total revenue overview?', 'How many invoices are overdue?'] },
            ].map(cat => (
              <div key={cat.label} style={{ background: 'var(--opsly-bg)', borderRadius: 8, padding: 16, border: '1px solid var(--opsly-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <cat.icon size={14} color="var(--opsly-accent)" />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{cat.label}</span>
                </div>
                {cat.examples.map(ex => (
                  <div key={ex} style={{ fontSize: 12, color: 'var(--opsly-text-muted)', padding: '4px 0', borderBottom: '1px solid var(--opsly-border-light)' }}>
                    &ldquo;{ex}&rdquo;
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Notifications Dropdown ─────────────────────────────────
function NotificationsDropdown({ notifications, onMarkAll }) {
  return (
    <div className="opsly-dropdown-overlay" style={{ width: 340 }}>
      <div className="opsly-notif-header">
        <span>Notifications</span>
        <button className="opsly-notif-clear-btn" onClick={onMarkAll}>Mark all read</button>
      </div>
      <div className="opsly-notif-list">
        {notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--opsly-text-muted)', fontSize: 13 }}>All caught up!</div>
        ) : notifications.slice(0, 8).map(n => (
          <div key={n.id} className={`opsly-notif-item ${!n.read ? 'unread' : ''}`}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--opsly-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiBell size={12} color="var(--opsly-accent)" />
            </div>
            <div className="opsly-notif-item-content">
              <div className="opsly-notif-item-title">{n.title}</div>
              <div className="opsly-notif-item-msg">{n.message}</div>
              <div className="opsly-notif-item-date">{n.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App Shell ─────────────────────────────────────────
function OpslyApp({ user, onLogout }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notifsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const root = document.querySelector('.opsly-app-root');
    if (root) root.setAttribute('data-theme', darkMode ? 'dark' : '');
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, p, t, i, a, n] = await Promise.all([
        api.getCustomers().catch(() => []),
        api.getProjects().catch(() => []),
        api.getTasks().catch(() => []),
        api.getInvoices().catch(() => []),
        api.getActivities().catch(() => []),
        api.getNotifications().catch(() => []),
      ]);
      setCustomers(c);
      setProjects(p);
      setTasks(t);
      setInvoices(i);
      setActivities(a);
      setNotifications(n);
    } catch (e) {
      toast('Failed to load data: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast('All notifications marked as read', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  const navItems = [
    { id: 'dashboard', icon: FiGrid, label: 'Dashboard' },
    { id: 'customers', icon: FiUsers, label: 'Customers' },
    { id: 'projects', icon: FiBriefcase, label: 'Projects' },
    { id: 'tasks', icon: FiCheckSquare, label: 'Tasks' },
    { id: 'invoices', icon: FiFileText, label: 'Invoices' },
    { id: 'team', icon: FiUsers, label: 'Team' },
    { id: 'ai', icon: FiCpu, label: 'Ask AI' },
  ];

  const viewTitles = {
    dashboard: 'Dashboard', customers: 'Customers', projects: 'Projects',
    tasks: 'Tasks', invoices: 'Invoices', team: 'Team', ai: 'Ask Opsly AI',
  };

  const navigate = (view) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <div className="opsly-app-root" data-theme={darkMode ? 'dark' : ''}>
      {/* Sidebar */}
      <aside className={`opsly-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="opsly-sidebar-header">
          {!sidebarCollapsed && <div className="opsly-logo">Ops<span>ly</span></div>}
          <button className="opsly-sidebar-toggle-btn" onClick={() => setSidebarCollapsed(v => !v)}>
            {sidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        <nav className="opsly-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`opsly-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => { setActiveView(item.id); setMobileOpen(false); }}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon size={18} />
              <span className="opsly-nav-item-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="opsly-sidebar-footer">
          <button className="opsly-nav-item" onClick={onLogout} title="Sign Out">
            <FiLogOut size={18} />
            <span className="opsly-nav-item-label">Sign Out</span>
          </button>
          {!sidebarCollapsed && (
            <p className="opsly-sidebar-about">
              Opsly — Portfolio demo by <strong>Craftivo</strong>. All data is fictional.
            </p>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="opsly-main-wrapper">
        {/* Header */}
        <header className="opsly-header">
          <div className="opsly-header-left">
            <button className="opsly-mobile-menu-trigger" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <h2 className="opsly-header-title">{viewTitles[activeView]}</h2>
          </div>

          <div className="opsly-header-right">
            <div className="opsly-header-search-bar" role="button" tabIndex={0} onClick={() => setCommandOpen(true)} onKeyDown={e => e.key === 'Enter' && setCommandOpen(true)}>
              <FiSearch size={14} />
              <span>Quick search...</span>
              <kbd className="opsly-header-search-kdb">⌘K</kbd>
            </div>

            <button className="opsly-header-icon-btn" title="Refresh data" onClick={fetchAll}>
              <FiRefreshCw size={16} />
            </button>

            <button className="opsly-header-icon-btn" title="Toggle theme" onClick={() => setDarkMode(v => !v)}>
              {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            <div style={{ position: 'relative' }} ref={notifsRef}>
              <button className="opsly-header-icon-btn" title="Notifications" onClick={() => { setShowNotifs(v => !v); setShowUserMenu(false); }}>
                <FiBell size={16} />
                {unreadCount > 0 && <span className="opsly-notification-dot" />}
              </button>
              {showNotifs && (
                <NotificationsDropdown
                  notifications={notifications}
                  onMarkAll={handleMarkAllRead}
                />
              )}
            </div>

            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <div className="opsly-user-menu" role="button" tabIndex={0} onClick={() => { setShowUserMenu(v => !v); setShowNotifs(false); }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--opsly-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {user?.name?.[0] || 'A'}
                </div>
                <span className="opsly-user-name">{user?.name || 'Admin'}</span>
              </div>
              {showUserMenu && (
                <div className="opsly-dropdown-overlay opsly-user-dropdown">
                  <div className="opsly-user-dropdown-header">
                    <div className="name">{user?.name}</div>
                    <div className="role">{user?.role}</div>
                  </div>
                  <div className="opsly-user-dropdown-item" onClick={() => { setActiveView('team'); setShowUserMenu(false); }}>
                    <FiUser size={14} /> My Profile
                  </div>
                  <div className="opsly-user-dropdown-item" onClick={() => { setDarkMode(v => !v); setShowUserMenu(false); }}>
                    {darkMode ? <FiSun size={14} /> : <FiMoon size={14} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </div>
                  <div className="opsly-user-dropdown-item logout" onClick={onLogout}>
                    <FiLogOut size={14} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="opsly-page-content">
          {activeView === 'dashboard' && <DashboardView customers={customers} projects={projects} tasks={tasks} invoices={invoices} activities={activities} />}
          {activeView === 'customers' && <CustomersView customers={customers} loading={loading} onRefresh={fetchAll} />}
          {activeView === 'projects' && <ProjectsView projects={projects} customers={customers} loading={loading} onRefresh={fetchAll} />}
          {activeView === 'tasks' && <TasksView tasks={tasks} projects={projects} loading={loading} onRefresh={fetchAll} />}
          {activeView === 'invoices' && <InvoicesView invoices={invoices} customers={customers} loading={loading} onRefresh={fetchAll} />}
          {activeView === 'team' && <TeamView />}
          {activeView === 'ai' && <AskAIView />}
        </main>
      </div>

      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
}

// ── Root Export ────────────────────────────────────────────
export default function OpslyPage() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('opsly_token');
    if (token) {
      api.getCurrentUser()
        .then(u => setUser(u))
        .catch(() => localStorage.removeItem('opsly_token'))
        .finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('opsly_token');
    setUser(null);
    toast('Signed out successfully', 'success');
  };

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Ops<span style={{ color: '#C96A32' }}>ly</span></div>
          <p style={{ color: '#888', marginTop: 8, fontSize: 13 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage onLogin={setUser} />
        <ToastContainer />
      </>
    );
  }

  return <OpslyApp user={user} onLogout={handleLogout} />;
}
