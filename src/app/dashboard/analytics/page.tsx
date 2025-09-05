"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";
import { classPerformance } from "@/lib/data";

const attendanceStatus = [
    { name: 'Above 90%', value: 70, fill: 'hsl(var(--chart-1))' },
    { name: '80-90%', value: 15, fill: 'hsl(var(--chart-2))' },
    { name: '70-80%', value: 10, fill: 'hsl(var(--chart-3))' },
    { name: 'Below 70%', value: 5, fill: 'hsl(var(--destructive))' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Performance Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Marks Distribution</CardTitle>
            <CardDescription>
              Comparing average scores with highest and lowest marks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={classPerformance}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}/>
                <Legend />
                <Bar dataKey="average" barSize={20} fill="hsl(var(--chart-1))" />
                <Line type="monotone" dataKey="highest" stroke="hsl(var(--chart-2))" />
                 <Line type="monotone" dataKey="lowest" stroke="hsl(var(--destructive))" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
            <CardDescription>
              Percentage of students in different attendance brackets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
                <RadialBarChart 
                    innerRadius="10%" 
                    outerRadius="80%" 
                    data={attendanceStatus} 
                    startAngle={180} 
                    endAngle={0}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar background dataKey='value' />
                    <Legend iconSize={10} layout='vertical' verticalAlign='middle' align="right" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
