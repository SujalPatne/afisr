import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Lightbulb, Users, BookOpen, Settings } from 'lucide-react';

export default function Recommendations() {
  const { franchises, students } = useData();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchRecommendations = () => {
    fetch('/api/recommendations')
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error("Failed to fetch recommendations", err));
  };

  useEffect(() => {
    fetchRecommendations();
  }, [franchises, students]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Attendance': return <Users className="w-5 h-5 text-blue-600" />;
      case 'Training': return <BookOpen className="w-5 h-5 text-purple-600" />;
      case 'Operations': return <Settings className="w-5 h-5 text-orange-600" />;
      default: return <Lightbulb className="w-5 h-5 text-amber-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'Attendance': return 'bg-blue-50 border-blue-100';
      case 'Training': return 'bg-purple-50 border-purple-100';
      case 'Operations': return 'bg-orange-50 border-orange-100';
      default: return 'bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Recommendations</h2>
          <p className="text-slate-500 mt-1">Actionable insights generated from franchise performance data.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <Lightbulb className="w-4 h-4" />
          Generate New Insights
        </button>
      </div>

      <div className="grid gap-4">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No Recommendations</h3>
            <p className="text-slate-500">All centers are performing well or there is not enough data.</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border ${getBgColor(rec.type)} flex items-start gap-4 transition-all hover:shadow-md`}
            >
              <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                {getIcon(rec.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    {rec.type} Action
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-sm font-medium text-slate-600">
                    {rec.center_name}
                  </span>
                </div>
                <p className="text-slate-800 text-lg font-medium">
                  {rec.message}
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
                    Create Task
                  </button>
                  <button className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
