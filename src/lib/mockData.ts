export const mockInsights = [
  {
    center_id: 1,
    name: "Downtown Center",
    revenue: 120000,
    enrollments: 150,
    teacher_rating: 4.5,
    avg_student_attendance: 0.95,
    avg_student_score: 88,
    total_students: 150,
    performance_status: "Healthy",
  },
  {
    center_id: 2,
    name: "Westside Branch",
    revenue: 45000,
    enrollments: 60,
    teacher_rating: 3.2,
    avg_student_attendance: 0.65,
    avg_student_score: 55,
    total_students: 60,
    performance_status: "Underperforming",
  },
  {
    center_id: 3,
    name: "North Hills Hub",
    revenue: 85000,
    enrollments: 110,
    teacher_rating: 4.0,
    avg_student_attendance: 0.9,
    avg_student_score: 82,
    total_students: 110,
    performance_status: "Healthy",
  },
];

export const mockRecommendations = [
  {
    center_id: 2,
    type: "Attendance",
    message:
      "Follow up with students at Westside Branch due to low average attendance (65%).",
  },
  {
    center_id: 2,
    type: "Training",
    message:
      "Teacher training recommended for Westside Branch (Rating: 3.2).",
  },
  {
    center_id: 2,
    type: "Operations",
    message:
      "Conduct an operational review for Westside Branch to improve revenue and conversions.",
  },
];

export const simulateChurnPrediction = (
  attendance: number,
  score: number,
  feeStatus: string
) => {
  let prob = 0.0;
  if (attendance < 0.6) prob += 0.4;
  if (score < 50) prob += 0.3;
  if (feeStatus === "Overdue") prob += 0.3;
  
  prob = Math.min(prob, 1.0);
  
  let risk = "Low";
  if (prob >= 0.7) risk = "High";
  else if (prob >= 0.4) risk = "Medium";

  return {
    risk_level: risk,
    churn_probability: prob,
  };
};
