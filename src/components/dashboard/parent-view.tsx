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
import { performanceData, students } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ParentView() {
  const student = students.find(s => s.id === 'S001');

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Student data not found.</p>
      </div>
    );
  }

  const mathData = performanceData.filter(p => p.subject === 'Mathematics').map(p => ({ name: p.month, Math: p.score }));
  const scienceData = performanceData.filter(p => p.subject === 'Science').map(p => ({ name: p.month, Science: p.score }));
  const historyData = performanceData.filter(p => p.subject === 'History').map(p => ({ name: p.month, History: p.score }));

  const combinedData = mathData.map((item, i) => ({
      ...item,
      ...scienceData[i],
      ...historyData[i]
  }));

  const lowAttendance = student.attendance < 80;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Progress report for {student.name}</h1>
      
      {lowAttendance && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Attendance Alert</AlertTitle>
          <AlertDescription>
            {student.name}'s attendance is at {student.attendance}%. Please ensure regular class participation.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Percentage</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.overallPercentage}%</div>
            <p className="text-xs text-muted-foreground">Status: {student.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.attendance}%</div>
            <p className="text-xs text-muted-foreground">School average is 92%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{student.rank}</div>
            <p className="text-xs text-muted-foreground">Out of {students.length} students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>Scores over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Line type="monotone" dataKey="Math" stroke="hsl(var(--chart-1))" />
              <Line type="monotone" dataKey="Science" stroke="hsl(var(--chart-2))" />
              <Line type="monotone" dataKey="History" stroke="hsl(var(--chart-3))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
