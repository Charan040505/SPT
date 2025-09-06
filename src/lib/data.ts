
import type { Student, PerformanceData, User, AttendanceData, AttendanceTrend, StudentMarks, TimetableEntry, Teacher, Syllabus, Note, Assignment } from '@/lib/types';

export const users: Record<string, User> = {
  'admin@educlarity.com': {
    name: 'Dr. Evelyn Reed',
    email: 'admin@educlarity.com',
    role: 'admin',
    password: 'password',
    avatarUrl: 'https://picsum.photos/id/1027/100/100',
    teacherId: 'T04',
    isVerified: true,
  },
  'student@educlarity.com': {
    name: 'Alex Johnson',
    email: 'student@educlarity.com',
    role: 'student',
    password: 'password',
    studentId: 'S001',
    avatarUrl: 'https://picsum.photos/id/1005/100/100',
    isVerified: true,
  },
  'parent@educlarity.com': {
    name: 'Maria Johnson',
    email: 'parent@educlarity.com',
    role: 'parent',
    password: 'password',
    studentId: 'S001',
    avatarUrl: 'https://picsum.photos/id/1025/100/100',
    isVerified: true,
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

function calculateMarks(mid1: number, mid2: number, external: number): Omit<StudentMarks, 'subject'> {
    const finalInternal = (mid1 + mid2) / 2;
    const total = finalInternal + external;
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else if (total >= 50) grade = 'D';

    return { mid1, mid2, finalInternal, external, total, grade };
}

export const studentMarksData: StudentMarks[] = [
    { subject: 'Mathematics', ...calculateMarks(42, 45, 48) },
    { subject: 'Science', ...calculateMarks(40, 48, 49) },
    { subject: 'History', ...calculateMarks(48, 49, 50) },
    { subject: 'English', ...calculateMarks(35, 40, 42) },
];

export const timetableData: TimetableEntry[] = [
  // Monday
  { day: 'Monday', period: 1, subject: 'Mathematics', teacher: 'Mr. Smith', startTime: '09:00', endTime: '10:00' },
  { day: 'Monday', period: 2, subject: 'Science', teacher: 'Ms. Jones', startTime: '10:00', endTime: '11:00' },
  { day: 'Monday', period: 3, subject: 'History', teacher: 'Mr. Davis', startTime: '11:00', endTime: '12:00' },
  { day: 'Monday', period: 4, subject: 'Lunch', teacher: '', startTime: '12:00', endTime: '13:00' },
  { day: 'Monday', period: 5, subject: 'English', teacher: 'Ms. Taylor', startTime: '13:00', endTime: '14:00' },
  // Tuesday
  { day: 'Tuesday', period: 1, subject: 'Science', teacher: 'Ms. Jones', startTime: '09:00', endTime: '10:00' },
  { day: 'Tuesday', period: 2, subject: 'English', teacher: 'Ms. Taylor', startTime: '10:00', endTime: '11:00' },
  { day: 'Tuesday', period: 3, subject: 'Art', teacher: 'Ms. Wilson', startTime: '11:00', endTime: '12:00' },
  { day: 'Tuesday', period: 4, subject: 'Lunch', teacher: '', startTime: '12:00', endTime: '13:00' },
  { day: 'Tuesday', period: 5, subject: 'Mathematics', teacher: 'Mr. Smith', startTime: '13:00', endTime: '14:00' },
  // Wednesday
  { day: 'Wednesday', period: 1, subject: 'History', teacher: 'Mr. Davis', startTime: '09:00', endTime: '10:00' },
  { day: 'Wednesday', period: 2, subject: 'Physical Education', teacher: 'Mr. Brown', startTime: '10:00', endTime: '11:00' },
  { day: 'Wednesday', period: 3, subject: 'Science', teacher: 'Ms. Jones', startTime: '11:00', endTime: '12:00' },
  { day: 'Wednesday', period: 4, subject: 'Lunch', teacher: '', startTime: '12:00', endTime: '13:00' },
  // Thursday
  { day: 'Thursday', period: 1, subject: 'English', teacher: 'Ms. Taylor', startTime: '09:00', endTime: '10:00' },
  { day: 'Thursday', period: 2, subject: 'Mathematics', teacher: 'Mr. Smith', startTime: '10:00', endTime: '11:00' },
  { day: 'Thursday', period: 3, subject: 'History', teacher: 'Mr. Davis', startTime: '11:00', endTime: '12:00' },
  { day: 'Thursday', period: 4, subject: 'Lunch', teacher: '', startTime: '12:00', endTime: '13:00' },
  { day: 'Thursday', period: 5, subject: 'Science', teacher: 'Ms. Jones', startTime: '13:00', endTime: '14:00' },
  // Friday
  { day: 'Friday', period: 1, subject: 'Art', teacher: 'Ms. Wilson', startTime: '09:00', endTime: '10:00' },
  { day: 'Friday', period: 2, subject: 'History', teacher: 'Mr. Davis', startTime: '10:00', endTime: '11:00' },
  { day: 'Friday', period: 3, subject: 'Mathematics', teacher: 'Mr. Smith', startTime: '11:00', endTime: '12:00' },
  { day: 'Friday', period: 4, subject: 'Lunch', teacher: '', startTime: '12:00', endTime: '13:00' },
];

export const teachers: Teacher[] = [
    { id: 'T01', name: 'Mr. Smith', subject: 'Mathematics', email: 'smith.math@educlarity.com', avatarUrl: 'https://picsum.photos/id/1062/100' },
    { id: 'T02', name: 'Ms. Jones', subject: 'Science', email: 'jones.sci@educlarity.com', avatarUrl: 'https://picsum.photos/id/1072/100' },
    { id: 'T03', name: 'Mr. Davis', subject: 'History', email: 'davis.hist@educlarity.com', avatarUrl: 'https://picsum.photos/id/1075/100' },
    { id: 'T04', name: 'Ms. Taylor', subject: 'English', email: 'taylor.eng@educlarity.com', avatarUrl: 'https://picsum.photos/id/1078/100' },
    { id: 'T05', name: 'Ms. Wilson', subject: 'Art', email: 'wilson.art@educlarity.com', avatarUrl: 'https://picsum.photos/id/1084/100' },
    { id: 'T06', name: 'Mr. Brown', subject: 'Physical Education', email: 'brown.pe@educlarity.com', avatarUrl: 'https://picsum.photos/id/102/100' }
]

export const syllabusData: Syllabus[] = [
    { subject: 'Mathematics', fileUrl: '/syllabus/math-syllabus.pdf', teacherId: 'T01' },
    { subject: 'Science', fileUrl: '/syllabus/science-syllabus.pdf', teacherId: 'T02' },
    { subject: 'History', fileUrl: '/syllabus/history-syllabus.pdf', teacherId: 'T03' },
    { subject: 'English', fileUrl: '/syllabus/english-syllabus.pdf', teacherId: 'T04' },
    { subject: 'Art', fileUrl: '/syllabus/art-syllabus.pdf', teacherId: 'T05' },
    { subject: 'Physical Education', fileUrl: '/syllabus/pe-syllabus.pdf', teacherId: 'T06' },
]

export const notesData: Note[] = [
    { id: 'N01', subject: 'Mathematics', title: 'Chapter 1: Algebra Basics', fileUrl: '/notes/math-algebra.pdf', fileType: 'PDF', uploadedAt: '2023-09-05' },
    { id: 'N02', subject: 'Mathematics', title: 'Chapter 2: Geometry Fundamentals', fileUrl: '/notes/math-geometry.pdf', fileType: 'PDF', uploadedAt: '2023-09-12' },
    { id: 'N03', subject: 'Science', title: 'Unit 1: Introduction to Biology', fileUrl: '/notes/sci-biology.pdf', fileType: 'PDF', uploadedAt: '2023-09-08' },
    { id: 'N04', subject: 'Science', title: 'Unit 2: The Periodic Table', fileUrl: '/notes/sci-chemistry.docx', fileType: 'DOC', uploadedAt: '2023-09-15' },
    { id: 'N05', subject: 'History', title: 'Ancient Civilizations: Rome', fileUrl: '/notes/hist-rome.pdf', fileType: 'PDF', uploadedAt: '2023-09-10' },
    { id: 'N06', subject: 'English', title: 'Literary Devices and Their Uses', fileUrl: '/notes/eng-lit-devices.pdf', fileType: 'PDF', uploadedAt: '2023-09-11' },
];

export const assignmentsData: Assignment[] = [
    { id: 'A01', subject: 'Mathematics', title: 'Algebra Worksheet', description: 'Complete all questions in the attached worksheet.', dueDate: '2024-07-25', status: 'Pending' },
    { id: 'A02', subject: 'Science', title: 'Lab Report: Photosynthesis', description: 'Write a 2-page lab report on the photosynthesis experiment.', dueDate: '2024-07-22', status: 'Submitted' },
    { id: 'A03', subject: 'History', title: 'Essay on the Roman Empire', description: 'A 1000-word essay on the fall of the Roman Empire.', dueDate: '2024-07-20', status: 'Late' },
    { id: 'A04', subject: 'English', title: 'Book Review: To Kill a Mockingbird', description: 'Submit a 500-word review of the book.', dueDate: '2024-07-30', status: 'Pending' },
];
