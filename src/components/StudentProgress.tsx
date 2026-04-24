import React, { useState, useMemo } from 'react';
import { useData, Student } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Clock, Target, Award, User, Filter } from 'lucide-react';

interface TestRecord {
  month: string;
  score: number;
  speed: number;   // math problems per minute
  accuracy: number; // percentage
}

// Function to generate realistic dummy test history for an MVP
const generateMockTestHistory = (student: Student): TestRecord[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Seed based on student ID to keep it consistent
  const seed = parseInt(student.id.replace(/\D/g, '')) || 0;
  
  // Base values depending on the student's current average
  const baseScore = student.test_score_avg;
  const baseAccuracy = student.test_score_avg > 80 ? 90 : (student.test_score_avg > 60 ? 75 : 60);
  const baseSpeed = student.test_score_avg > 80 ? 45 : (student.test_score_avg > 60 ? 30 : 20);

  // Is student improving or declining?
  const trend = (seed % 3) === 0 ? -1 : 1; 

  return months.map((month, index) => {
    // Adding some variance and trend
    const variance = (Math.sin(seed + index) * 5);
    const trendEffect = trend * index * 2;

    return {
      month,
      score: Math.min(100, Math.max(0, Math.round(baseScore - 10 + (index * 2) + variance + trendEffect))),
      speed: Math.max(10, Math.round(baseSpeed + (index * 1.5) + variance * 0.5)),
      accuracy: Math.min(100, Math.max(0, Math.round(baseAccuracy + variance + trendEffect * 0.5)))
    };
  });
};

export default function StudentProgress() {
  const { students, franchises } = useData();
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Attach mock history and determine warnings
  const enrichedStudents = useMemo(() => {
    return students.map(s => {
      const history = generateMockTestHistory(s);
      const recentTests = history.slice(-2);
      let isWeak = false;
      let warningMsg = '';

      // Flagging logic: if recent scores drop below 60 or accuracy < 70
      const currentAcc = recentTests[1]?.accuracy || 0;
      const currentScore = recentTests[1]?.score || 0;
      const prevScore = recentTests[0]?.score || 0;

      if (currentScore < 60) {
        isWeak = true;
        warningMsg = 'Low test scores. Immediate intervention required.';
      } else if (currentAcc < 70) {
        isWeak = true;
        warningMsg = 'Low calculation accuracy. Needs more practice.';
      } else if (currentScore < prevScore - 10) {
        isWeak = true;
        warningMsg = 'Sudden drop in performance.';
      }

      return {
        ...s,
        history,
        isWeak,
        warningMsg,
        currentScore,
        currentAcc,
        currentSpeed: recentTests[1]?.speed || 0
      };
    });
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (selectedCenter === 'all') return enrichedStudents;
    return enrichedStudents.filter(s => s.center_id === selectedCenter);
  }, [enrichedStudents, selectedCenter]);

  // Set the first student as default if none selected
  React.useEffect(() => {
    if (!selectedStudentId && filteredStudents.length > 0) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];

  if (!students.length) {
    return <div className="text-slate-500 text-center py-10 text-lg">Loading student data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Student Progress Tracking</h2>
          <p className="text-slate-500 mt-2">Monitor test scores, speed, accuracy, and flag weak students.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedCenter}
            onChange={(e) => {
              setSelectedCenter(e.target.value);
              setSelectedStudentId(null); // reset selection
            }}
          >
            <option value="all">All Franchise Centers</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Student List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="bg-slate-50 border-b border-slate-200 p-4 sticky top-0">
            <h3 className="font-semibold text-slate-800">Students ({filteredStudents.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                  selectedStudentId === student.id 
                    ? 'bg-indigo-50 border border-indigo-200' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    student.isWeak ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className={`text-sm font-medium truncate ${selectedStudentId === student.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{student.course}</p>
                  </div>
                </div>
                {student.isWeak && (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Progress Details */}
        {selectedStudent ? (
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Profile */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <span>{selectedStudent.course}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{franchises.find(f => f.id === selectedStudent.center_id)?.name}</span>
                </p>
              </div>
              
              {selectedStudent.isWeak ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-start gap-3 max-w-sm">
                  <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-rose-800 text-sm">Needs Attention</h4>
                    <p className="text-sm mt-1 opacity-90">{selectedStudent.warningMsg}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 text-sm">On Track</h4>
                    <p className="text-sm mt-0.5 opacity-90">Progressing well in the course.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-600">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-medium text-sm">Current Score</h4>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{selectedStudent.currentScore}</span>
                  <span className="text-sm text-slate-500 mb-1">/ 100</span>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-600">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-medium text-sm">Accuracy</h4>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{selectedStudent.currentAcc}%</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-600">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <h4 className="font-medium text-sm">Speed</h4>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{selectedStudent.currentSpeed}</span>
                  <span className="text-sm text-slate-500 mb-1">prob/min</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h4 className="font-semibold text-slate-800 mb-6">Score & Accuracy Tracking</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedStudent.history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Line yAxisId="left" type="monotone" name="Test Score" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      <Line yAxisId="left" type="monotone" name="Accuracy %" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h4 className="font-semibold text-slate-800 mb-6">Speed Development (Problems/Min)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedStudent.history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" name="Speed" dataKey="speed" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSpeed)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm h-64 text-slate-500">
            Select a student to view their progress.
          </div>
        )}
      </div>
    </div>
  );
}
