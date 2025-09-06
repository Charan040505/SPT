
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, CheckCircle, Percent, Star, UserCheck } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { performanceData, students, studentAttendanceData, studentAttendanceTrend, studentMarksData, timetableData } from "@/lib/data";
import PersonalizedRecommendations from "./personalized-recommendations";
import AttendanceTracker from "./attendance-tracker";
import MarksViewer from "./marks-viewer";
import TimetableView from "./timetable-view";

export default function StudentView() {
  const student = students.find(s => s.id === 'S001')!;

  const mathData = performanceData.filter(p => p.subject === 'Mathematics').map(p => ({ name: p.month, Math: p.score }));
  const scienceData = performanceData.filter(p => p.subject === 'Science').map(p => ({ name: p.month, Science: p.score }));
  const historyData = performanceData.filter(p => p.subject === 'History').map(p => ({ name: p.month, History: p.score }));

  const combinedData = mathData.map((item, i) => ({
      ...item,
      ...scienceData[i],
      ...historyData[i]
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Welcome, {student.name}!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Percentage</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.overallPercentage}%</div>
            <p className="text-xs text-muted-foreground">Status: {student.status}</p>
          </CardContent>
        </Card>
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.attendance}%</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{student.rank}</div>
            <p className="text-xs text-muted-foreground">Out of {students.length} students</p>
          </CardContent>
        </Card>
         <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Scored over 90%</p>
          </CardContent>
        </Card>
      </div>

       <div className="space-y-6">
        <TimetableView timetableData={timetableData} />
      </div>

       <div className="space-y-6">
        <MarksViewer marksData={studentMarksData} />
      </div>

      <div className="space-y-6">
        <AttendanceTracker attendanceData={studentAttendanceData} attendanceTrend={studentAttendanceTrend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Performance Trend</CardTitle>
            <CardDescription>Your scores over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Line type="monotone" dataKey="Math" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Science" stroke="hsl(var(--chart-2))" />
                <Line type="monotone" dataKey="History" stroke="hsl(var(--chart-3))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <PersonalizedRecommendations student={student} />
      </div>
    </div>
  );
}
