
import type { Student, PerformanceData, User, AttendanceData, AttendanceTrend } from '@/lib/types';

export const users: Record<string, User> = {
  'admin@educlarity.com': {
    name: 'Dr. Evelyn Reed',
    email: 'admin@educlarity.com',
    role: 'admin',
    avatarUrl: 'https://picsum.photos/id/1027/100/100',
  },
  'student@educlarity.com': {
    name: 'Alex Johnson',
    email: 'student@educlarity.com',
    role: 'student',
    studentId: 'S001',
    avatarUrl: 'https://picsum.photos/id/1005/100/100',
  },
  'parent@educlarity.com': {
    name: 'Maria Johnson',
    email: 'parent@educlarity.com',
    role: 'parent',
    studentId: 'S001',
    avatarUrl: 'https://picsum.photos/id/1025/100/100',
  },
};

export const students: Student[] = [
  {
    id: 'S001',
    name: 'Alex Johnson',
    grade: 10,
    rollNo: '10A-01',
    attendance: 95,
    overallPercentage: 88,
    rank: 5,
    status: 'On Track',
  },
  {
    id: 'S002',
    name: 'Brenda Smith',
    grade: 10,
    rollNo: '10A-02',
    attendance: 74,
    overallPercentage: 65,
    rank: 25,
    status: 'At Risk',
  },
  {
    id: 'S003',
    name: 'Charlie Brown',
    grade: 10,
    rollNo: '10A-03',
    attendance: 98,
    overallPercentage: 92,
    rank: 2,
    status: 'Excelling',
  },
  {
    id: 'S004',
    name: 'Diana Prince',
    grade: 10,
    rollNo: '10A-04',
    attendance: 82,
    overallPercentage: 78,
    rank: 12,
    status: 'On Track',
  },
  {
    id: 'S005',
    name: 'Ethan Hunt',
    grade: 10,
    rollNo: '10A-05',
    attendance: 68,
    overallPercentage: 71,
    rank: 18,
    status: 'Needs Improvement',
  },
  {
    id: 'S006',
    name: 'Fiona Glenanne',
    grade: 10,
    rollNo: '10A-06',
    attendance: 100,
    overallPercentage: 99,
    rank: 1,
    status: 'Excelling',
  },
];

export const performanceData: PerformanceData[] = [
  { month: 'Jan', score: 75, subject: 'Mathematics' },
  { month: 'Feb', score: 78, subject: 'Mathematics' },
  { month: 'Mar', score: 82, subject: 'Mathematics' },
  { month: 'Apr', score: 80, subject: 'Mathematics' },
  { month: 'May', score: 85, subject: 'Mathematics' },
  { month: 'Jun', score: 88, subject: 'Mathematics' },
  { month: 'Jan', score: 80, subject: 'Science' },
  { month: 'Feb', score: 81, subject: 'Science' },
  { month: 'Mar', score: 79, subject: 'Science' },
  { month: 'Apr', score: 85, subject: 'Science' },
  { month: 'May', score: 88, subject: 'Science' },
  { month: 'Jun', score: 90, subject: 'Science' },
  { month: 'Jan', score: 90, subject: 'History' },
  { month: 'Feb', score: 88, subject: 'History' },
  { month: 'Mar', score: 92, subject: 'History' },
  { month: 'Apr', score: 94, subject: 'History' },
  { month: 'May', score: 91, subject: 'History' },
  { month: 'Jun', score: 95, subject: 'History' },
];

export const classPerformance = [
    { name: 'Mathematics', average: 82, highest: 100, lowest: 65 },
    { name: 'Science', average: 85, highest: 98, lowest: 70 },
    { name: 'History', average: 91, highest: 100, lowest: 75 },
    { name: 'English', average: 88, highest: 99, lowest: 72 },
    { name: 'Art', average: 94, highest: 100, lowest: 85 },
];

export const studentAttendanceData: AttendanceData[] = [
    { subject: 'Mathematics', totalClasses: 60, attendedClasses: 58 },
    { subject: 'Science', totalClasses: 55, attendedClasses: 54 },
    { subject: 'History', totalClasses: 50, attendedClasses: 49 },
    { subject: 'English', totalClasses: 58, attendedClasses: 55 },
    { subject: 'Art', totalClasses: 40, attendedClasses: 35 },
    { subject: 'Physical Education', totalClasses: 35, attendedClasses: 20 },
];

export const studentAttendanceTrend: AttendanceTrend[] = [
    { month: 'Jan', percentage: 92 },
    { month: 'Feb', percentage: 95 },
    { month: 'Mar', percentage: 88 },
    { month: 'Apr', percentage: 93 },
    { month: 'May', percentage: 90 },
    { month: 'Jun', percentage: 96 },
];
