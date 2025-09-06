
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import type { AttendanceData, AttendanceTrend } from "@/lib/types";
import { cn } from "@/lib/utils";

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 75) return "bg-green-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

export default function AttendanceTracker({
  attendanceData,
  attendanceTrend,
}: {
  attendanceData: AttendanceData[];
  attendanceTrend: AttendanceTrend[];
}) {
    const overallAttended = attendanceData.reduce((acc, item) => acc + item.attendedClasses, 0);
    const overallTotal = attendanceData.reduce((acc, item) => acc + item.totalClasses, 0);
    const overallPercentage = overallTotal > 0 ? Math.round((overallAttended / overallTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>Your subject-wise attendance.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Overall</p>
                    <p className="text-2xl font-bold">{overallPercentage}%</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Classes Attended</p>
                    <p className="text-2xl font-bold">{overallAttended}/{overallTotal}</p>
                </div>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((item) => {
                const percentage = Math.round(
                  (item.attendedClasses / item.totalClasses) * 100
                );
                return (
                  <TableRow key={item.subject}>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{percentage}%</span>
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            getAttendanceColor(percentage)
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Attendance Trend</CardTitle>
          <CardDescription>
            Your attendance percentage over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[50, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Attendance"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
