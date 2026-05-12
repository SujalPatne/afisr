import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, AlertTriangle, TrendingDown, UserMinus, 
  IndianRupee, Award, Bell, X, CheckCircle, 
  ChevronRight, Clock, Eye
} from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  student_name: string | null;
  center_name: string | null;
  is_read: boolean;
  created_at: string;
}

export default function TodaysFocus() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const dismissAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}/dismiss`, { method: 'PATCH' });
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to dismiss', err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}/read`, { method: 'PATCH' });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const getIcon = (type: string, severity: string) => {
    const size = 'w-5 h-5';
    switch (type) {
      case 'fee_overdue': return <IndianRupee className={`${size} text-rose-500`} />;
      case 'churn_risk': return <UserMinus className={`${size} text-red-600`} />;
      case 'attendance_drop': return <TrendingDown className={`${size} text-amber-500`} />;
      case 'score_drop': return <AlertTriangle className={`${size} text-orange-500`} />;
      case 'achievement': return <Award className={`${size} text-emerald-500`} />;
      default: return <Bell className={`${size} text-slate-500`} />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return {
        border: 'border-l-4 border-l-rose-500 bg-rose-50/60',
        badge: 'bg-rose-100 text-rose-700',
        label: 'CRITICAL'
      };
      case 'high': return {
        border: 'border-l-4 border-l-orange-400 bg-orange-50/60',
        badge: 'bg-orange-100 text-orange-700',
        label: 'HIGH'
      };
      case 'medium': return {
        border: 'border-l-4 border-l-amber-400 bg-amber-50/40',
        badge: 'bg-amber-100 text-amber-700',
        label: 'MEDIUM'
      };
      case 'low': return {
        border: 'border-l-4 border-l-blue-300 bg-blue-50/40',
        badge: 'bg-blue-100 text-blue-700',
        label: 'LOW'
      };
      case 'info': return {
        border: 'border-l-4 border-l-emerald-400 bg-emerald-50/40',
        badge: 'bg-emerald-100 text-emerald-700',
        label: 'INFO'
      };
      default: return {
        border: 'border-l-4 border-l-slate-300 bg-slate-50',
        badge: 'bg-slate-100 text-slate-600',
        label: 'NOTE'
      };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fee_overdue': return 'Fee Overdue';
      case 'churn_risk': return 'Dropout Risk';
      case 'attendance_drop': return 'Attendance';
      case 'score_drop': return 'Performance';
      case 'achievement': return 'Achievement';
      default: return 'General';
    }
  };

  const getTimeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const criticalCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
  const unreadCount = alerts.filter(a => !a.is_read).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: alerts.length },
    { value: 'fee_overdue', label: 'Fees', count: alerts.filter(a => a.type === 'fee_overdue').length },
    { value: 'churn_risk', label: 'Churn', count: alerts.filter(a => a.type === 'churn_risk').length },
    { value: 'attendance_drop', label: 'Attendance', count: alerts.filter(a => a.type === 'attendance_drop').length },
    { value: 'score_drop', label: 'Scores', count: alerts.filter(a => a.type === 'score_drop').length },
    { value: 'achievement', label: 'Wins', count: alerts.filter(a => a.type === 'achievement').length },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Today's Focus</h2>
          <p className="text-slate-500 mt-1">
            {criticalCount > 0 
              ? `${criticalCount} urgent item${criticalCount > 1 ? 's' : ''} need${criticalCount === 1 ? 's' : ''} your attention`
              : 'Everything looks good across your centers'}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Critical</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {alerts.filter(a => a.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">High</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {alerts.filter(a => a.severity === 'high').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Bell className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Medium</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {alerts.filter(a => a.severity === 'medium').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Good News</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {alerts.filter(a => a.type === 'achievement').length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
        {filterOptions.filter(f => f.count > 0 || f.value === 'all').map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filter === opt.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {opt.label}
            {opt.count > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === opt.value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {opt.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">All Clear!</h3>
            <p className="text-slate-500 mt-1">No alerts in this category. Keep up the great work.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md ${styles.border} ${!alert.is_read ? 'ring-1 ring-indigo-100' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0 mt-0.5">
                      {getIcon(alert.type, alert.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
                          {styles.label}
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          {getTypeLabel(alert.type)}
                        </span>
                        {!alert.is_read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        )}
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 leading-snug">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                        {alert.center_name && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                            {alert.center_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeSince(alert.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!alert.is_read && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
