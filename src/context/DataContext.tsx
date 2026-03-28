import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Franchise {
  id: string;
  name: string;
  location: string;
  manager: string;
  teacher_rating: number;
}

export interface Student {
  id: string;
  name: string;
  center_id: string;
  course: string; // e.g., Abacus, Vedic Math, Phonics
  attendance_rate: number; // 0.0 to 1.0
  test_score_avg: number; // 0 to 100
  fee_status: 'Paid' | 'Pending' | 'Overdue';
}

interface DataContextType {
  franchises: Franchise[];
  students: Student[];
  addFranchise: (franchise: Omit<Franchise, 'id'>) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  deleteFranchise: (id: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setFranchises(data.franchises);
      setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addFranchise = async (franchise: Omit<Franchise, 'id'>) => {
    const res = await fetch('/api/franchises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(franchise)
    });
    const newFranchise = await res.json();
    setFranchises([...franchises, newFranchise]);
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    const newStudent = await res.json();
    setStudents([...students, newStudent]);
  };

  const deleteFranchise = async (id: string) => {
    await fetch(`/api/franchises/${id}`, { method: 'DELETE' });
    setFranchises(franchises.filter(f => f.id !== id));
    setStudents(students.filter(s => s.center_id !== id));
  };

  const deleteStudent = async (id: string) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <DataContext.Provider value={{ franchises, students, addFranchise, addStudent, deleteFranchise, deleteStudent }}>
      {!loading && children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
