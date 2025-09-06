

export type UserRole = 'admin' | 'student' | 'parent';

export type User = {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  studentId?: string; // For student and parent roles
};

export type Student = {
  id: string;
  name: string;
  grade: number;
  rollNo: string;
  attendance: number;
  overallPercentage: number;
  rank: number;
  status: 'Excelling' | 'On Track' | 'Needs Improvement' | 'At Risk';
};

export type PerformanceData = {
  month: string;
  score: number;
  subject: string;
};

export type AttendanceData = {
  subject: string;
  totalClasses: number;
  attendedClasses: number;
};

export type AttendanceTrend = {
    month: string;
    percentage: number;
}

export type StudentMarks = {
    subject: string;
    mid1: number;
    mid2: number;
    external: number;
    finalInternal: number;
    total: number;
    grade: string;
};

export type TimetableEntry = {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
};
