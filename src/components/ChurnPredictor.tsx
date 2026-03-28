import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { simulateChurnPrediction } from '../lib/mockData';
import { AlertCircle, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

export default function ChurnPredictor() {
  const { students } = useData();
  
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [attendance, setAttendance] = useState('0.85');
  const [score, setScore] = useState('75');
  const [feeStatus, setFeeStatus] = useState('Paid');
  const [result, setResult] = useState<{ risk_level: string; churn_probability: number } | null>(null);

  // Auto-fill form when a student is selected
  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setAttendance(student.attendance_rate.toString());
        setScore(student.test_score_avg.toString());
        setFeeStatus(student.fee_status);
        setResult(null); // Clear previous result
      }
    }
  }, [selectedStudentId, students]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/predict_churn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: parseFloat(attendance),
          score: parseFloat(score),
          feeStatus
        })
      });
      const prediction = await res.json();
      setResult(prediction);
    } catch (error) {
      console.error("Prediction failed", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Churn Predictor</h2>
          <p className="text-slate-500 mt-1">Select an existing student or enter metrics manually to predict dropout risk.</p>
        </div>

        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            Select Student (Optional)
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Manual Entry --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
            ))}
          </select>
        </div>

        <form onSubmit={handlePredict} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attendance Rate (0.0 to 1.0)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Average Test Score (0 to 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fee Payment Status
            </label>
            <select
              value={feeStatus}
              onChange={(e) => setFeeStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Predict Risk
          </button>
        </form>

        {result && (
          <div className={`mt-8 p-6 rounded-xl border ${
            result.risk_level === 'High' ? 'bg-rose-50 border-rose-200' :
            result.risk_level === 'Medium' ? 'bg-amber-50 border-amber-200' :
            'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-start gap-4">
              {result.risk_level === 'High' ? (
                <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />
              ) : result.risk_level === 'Medium' ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              )}
              
              <div>
                <h3 className={`text-lg font-bold ${
                  result.risk_level === 'High' ? 'text-rose-900' :
                  result.risk_level === 'Medium' ? 'text-amber-900' :
                  'text-emerald-900'
                }`}>
                  {result.risk_level} Risk of Churn
                </h3>
                <p className={`mt-1 ${
                  result.risk_level === 'High' ? 'text-rose-700' :
                  result.risk_level === 'Medium' ? 'text-amber-700' :
                  'text-emerald-700'
                }`}>
                  The model predicts a <strong>{(result.churn_probability * 100).toFixed(0)}%</strong> probability that this student will drop out.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
