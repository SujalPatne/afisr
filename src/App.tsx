import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Dashboard from './components/Dashboard';
import ChurnPredictor from './components/ChurnPredictor';
import Recommendations from './components/Recommendations';
import AdminPanel from './components/AdminPanel';
import { LayoutDashboard, UserMinus, Lightbulb, BrainCircuit, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 text-white">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AFISR</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Insights Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('churn')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'churn' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserMinus className="w-5 h-5" />
              Churn Predictor
            </button>
            
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'recommendations' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              Recommendations
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-5 h-5" />
              Admin Data Entry
            </button>
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
              {activeTab === 'dashboard' && 'Franchise Intelligence'}
              {activeTab === 'churn' && 'Student Retention'}
              {activeTab === 'recommendations' && 'Actionable Insights'}
              {activeTab === 'admin' && 'Data Management'}
            </h1>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'churn' && <ChurnPredictor />}
            {activeTab === 'recommendations' && <Recommendations />}
            {activeTab === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>
    </DataProvider>
  );
}
