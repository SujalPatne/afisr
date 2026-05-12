import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  IndianRupee, TrendingUp, AlertCircle, CheckCircle2, 
  Clock, CreditCard, Search, Filter, ChevronDown, Check
} from 'lucide-react';

interface FeeSummary {
  totals: {
    paid_count: number;
    pending_count: number;
    overdue_count: number;
    total_collected: number;
    total_pending: number;
    total_overdue: number;
    total_expected: number;
    collection_rate: number;
  };
  by_center: {
    center_id: string;
    center_name: string;
    collected: number;
    outstanding: number;
    paid_count: number;
    unpaid_count: number;
  }[];
  overdue_students: {
    student_id: string;
    student_name: string;
    center_name: string;
    overdue_months: number;
    total_overdue: number;
  }[];
}

interface FeeRecord {
  id: string;
  student_id: string;
  student_name: string;
  center_name: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: string;
  payment_method: string | null;
  month_label: string;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function FeesDashboard() {
  const { franchises } = useData();
  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'records'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/fees/summary').then(r => r.json()),
      fetch('/api/fees').then(r => r.json()),
    ]).then(([sumData, feeData]) => {
      setSummary(sumData);
      setFees(Array.isArray(feeData) ? feeData : []);
    }).catch(err => console.error('Failed to load fee data', err))
    .finally(() => setLoading(false));
  }, []);

  const handleRecordPayment = async (feeId: string) => {
    setPayingFeeId(feeId);
    try {
      const res = await fetch(`/api/fees/${feeId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'Cash' })
      });
      if (res.ok) {
        const updated = await res.json();
        setFees(prev => prev.map(f => f.id === feeId ? { ...f, ...updated, status: 'Paid', paid_date: updated.paid_date } : f));
        // Refresh summary
        const sumRes = await fetch('/api/fees/summary');
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
    } catch (err) {
      console.error('Payment recording failed', err);
    } finally {
      setPayingFeeId(null);
    }
  };

  const filteredFees = fees.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (centerFilter !== 'all' && !f.center_name?.includes(centerFilter)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-100 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return <div className="text-slate-500 text-center py-10">Failed to load fee data.</div>;
  }

  const pieData = [
    { name: 'Collected', value: summary.totals.total_collected },
    { name: 'Pending', value: summary.totals.total_pending },
    { name: 'Overdue', value: summary.totals.total_overdue },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Collection</h2>
          <p className="text-slate-500 mt-1">Track payments, outstanding dues, and collection rates across centers.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView('overview')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView('records')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === 'records' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Records
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Total Collected</span>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{summary.totals.total_collected.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            {(summary.totals.collection_rate * 100).toFixed(0)}% collection rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Pending</span>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{summary.totals.total_pending.toLocaleString('en-IN')}</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">
            {summary.totals.pending_count} payment{summary.totals.pending_count !== 1 ? 's' : ''} pending
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Overdue</span>
            <div className="p-2 bg-rose-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600">₹{summary.totals.total_overdue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-rose-600 mt-1 font-medium">
            {summary.totals.overdue_count} payment{summary.totals.overdue_count !== 1 ? 's' : ''} overdue
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Total Expected</span>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{summary.totals.total_expected.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-1">
            {summary.totals.paid_count + summary.totals.pending_count + summary.totals.overdue_count} total invoices
          </p>
        </div>
      </div>

      {view === 'overview' ? (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collection by Center */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Collection by Center</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.by_center} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `₹${v/1000}k`} />
                    <YAxis type="category" dataKey="center_name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12 }} width={140} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name === 'collected' ? 'Collected' : 'Outstanding']}
                    />
                    <Bar dataKey="collected" fill="#10b981" radius={[0, 4, 4, 0]} name="collected" stackId="a" />
                    <Bar dataKey="outstanding" fill="#f59e0b" radius={[0, 4, 4, 0]} name="outstanding" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Status Pie */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Status Breakdown</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {pieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overdue Students Table */}
          {summary.overdue_students.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-slate-800">Students with Overdue Fees</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Center</th>
                      <th className="px-6 py-3">Months Overdue</th>
                      <th className="px-6 py-3">Amount Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.overdue_students.map(s => (
                      <tr key={s.student_id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{s.student_name}</td>
                        <td className="px-6 py-4 text-slate-600">{s.center_name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                            {s.overdue_months} month{s.overdue_months > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-rose-600">₹{s.total_overdue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Records View */
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <select
              value={centerFilter}
              onChange={e => setCenterFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All Centers</option>
              {franchises.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
            <span className="text-sm text-slate-400 ml-auto">
              {filteredFees.length} record{filteredFees.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Center</th>
                    <th className="px-6 py-3">Month</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map(fee => (
                    <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{fee.student_name}</td>
                      <td className="px-6 py-4 text-slate-600">{fee.center_name}</td>
                      <td className="px-6 py-4 text-slate-600">{fee.month_label}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">₹{fee.amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(fee.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                          fee.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {fee.status === 'Paid' && <Check className="w-3 h-3 mr-1" />}
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {fee.status !== 'Paid' ? (
                          <button
                            onClick={() => handleRecordPayment(fee.id)}
                            disabled={payingFeeId === fee.id}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            {payingFeeId === fee.id ? 'Recording...' : 'Record Payment'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {fee.paid_date ? `Paid ${new Date(fee.paid_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'Paid'}
                            {fee.payment_method && ` • ${fee.payment_method}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredFees.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No fee records match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
