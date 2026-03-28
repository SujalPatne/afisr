import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Building2, GraduationCap } from 'lucide-react';

export default function AdminPanel() {
  const { franchises, students, addFranchise, addStudent, deleteFranchise, deleteStudent } = useData();

  // Franchise Form State
  const [fName, setFName] = useState('');
  const [fLocation, setFLocation] = useState('');
  const [fManager, setFManager] = useState('');
  const [fRating, setFRating] = useState('4.0');

  // Student Form State
  const [sName, setSName] = useState('');
  const [sCenter, setSCenter] = useState(franchises[0]?.id || '');
  const [sCourse, setSCourse] = useState('Abacus');
  const [sAttendance, setSAttendance] = useState('0.85');
  const [sScore, setSScore] = useState('75');
  const [sFee, setSFee] = useState<'Paid' | 'Pending' | 'Overdue'>('Paid');

  const handleAddFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    addFranchise({
      name: fName,
      location: fLocation,
      manager: fManager,
      teacher_rating: parseFloat(fRating),
    });
    setFName('');
    setFLocation('');
    setFManager('');
    setFRating('4.0');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sCenter) return alert('Please select a franchise center first.');
    addStudent({
      name: sName,
      center_id: sCenter,
      course: sCourse,
      attendance_rate: parseFloat(sAttendance),
      test_score_avg: parseFloat(sScore),
      fee_status: sFee,
    });
    setSName('');
    setSAttendance('0.85');
    setSScore('75');
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Data Entry</h2>
        <p className="text-slate-500 mt-1">Manage Franchise Centers and Students for Metro Brain Educare.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Franchise Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Add Franchise Center</h3>
          </div>
          
          <form onSubmit={handleAddFranchise} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Center Name</label>
              <input type="text" required value={fName} onChange={e => setFName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Downtown Center" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" required value={fLocation} onChange={e => setFLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. New York" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                <input type="text" required value={fManager} onChange={e => setFManager(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teacher Rating (1.0 - 5.0)</label>
              <input type="number" step="0.1" min="1" max="5" required value={fRating} onChange={e => setFRating(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Franchise
            </button>
          </form>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Existing Centers</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {franchises.map(f => (
                <li key={f.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.location} • Rating: {f.teacher_rating}</p>
                  </div>
                  <button onClick={() => deleteFranchise(f.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Student Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Add Student</h3>
          </div>
          
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
              <input type="text" required value={sName} onChange={e => setSName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Emma Watson" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Franchise Center</label>
                <select required value={sCenter} onChange={e => setSCenter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  {franchises.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                <select required value={sCourse} onChange={e => setSCourse(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="Abacus">Abacus</option>
                  <option value="Vedic Math">Vedic Math</option>
                  <option value="Brain Activation">Brain Activation</option>
                  <option value="Phonics">Phonics</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Attendance (0-1)</label>
                <input type="number" step="0.01" min="0" max="1" required value={sAttendance} onChange={e => setSAttendance(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Score (0-100)</label>
                <input type="number" min="0" max="100" required value={sScore} onChange={e => setSScore(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fee Status</label>
                <select required value={sFee} onChange={e => setSFee(e.target.value as any)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </form>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Students</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {students.slice().reverse().map(s => {
                const centerName = franchises.find(f => f.id === s.center_id)?.name || 'Unknown Center';
                return (
                  <li key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{s.name} <span className="text-xs font-normal text-slate-500">({s.course})</span></p>
                      <p className="text-xs text-slate-500">{centerName} • Att: {(s.attendance_rate*100).toFixed(0)}% • Score: {s.test_score_avg}</p>
                    </div>
                    <button onClick={() => deleteStudent(s.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
