import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import Dashboard from './components/Dashboard';
import ChurnPredictor from './components/ChurnPredictor';
import Recommendations from './components/Recommendations';
import AdminPanel from './components/AdminPanel';
import StudentProgress from './components/StudentProgress';
import TodaysFocus from './components/TodaysFocus';
import FeesDashboard from './components/FeesDashboard';
import { 
  LayoutDashboard, UserMinus, Lightbulb, BrainCircuit, 
  Database, Activity, Zap, IndianRupee, Bell
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('focus');
  const [alertCount, setAlertCount] = useState(0);

  // Fetch unread alert count for badge
  useEffect(() => {
    fetch('/api/alerts/count')
      .then(r => r.json())
      .then(data => setAlertCount(data.count || 0))
      .catch(() => {});
  }, [activeTab]); // refresh on tab change

  const navItems = [
    { id: 'focus', label: "Today's Focus", icon: Zap, badge: alertCount },
    { id: 'dashboard', label: 'Center Insights', icon: LayoutDashboard },
    { id: 'fees', label: 'Fee Collection', icon: IndianRupee },
    { id: 'progress', label: 'Student Progress', icon: Activity },
    { id: 'churn', label: 'Who Might Drop Out?', icon: UserMinus },
    { id: 'recommendations', label: 'Action Items', icon: Lightbulb },
    { id: 'admin', label: 'Manage Data', icon: Database },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'focus': return "Today's Focus";
      case 'dashboard': return 'Center Insights';
      case 'fees': return 'Fee Collection';
      case 'churn': return 'Who Might Drop Out?';
      case 'recommendations': return 'Action Items';
      case 'progress': return 'Student Progress';
      case 'admin': return 'Manage Students & Centers';
      default: return 'AFISR';
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 text-white">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-tight">AFISR</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Intelligence System</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 mt-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white font-medium' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
                HQ
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-500">Metro Brain EduCare</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-slate-800">
              {getPageTitle()}
            </h1>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto">
            {activeTab === 'focus' && <TodaysFocus />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'fees' && <FeesDashboard />}
            {activeTab === 'churn' && <ChurnPredictor />}
            {activeTab === 'recommendations' && <Recommendations />}
            {activeTab === 'progress' && <StudentProgress />}
            {activeTab === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>
    </DataProvider>
  );
}
