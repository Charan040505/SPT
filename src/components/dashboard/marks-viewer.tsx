
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import type { StudentMarks } from "@/lib/types";

export default function MarksViewer({ marksData }: { marksData: StudentMarks[] }) {
  const chartData = marksData.map(d => ({
    name: d.subject,
    "Mid-1": d.mid1,
    "Mid-2": d.mid2,
    "Semester Total": d.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Marks</CardTitle>
        <CardDescription>A detailed view of your performance in each subject.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Mid-1</TableHead>
                <TableHead className="text-center">Mid-2</TableHead>
                <TableHead className="text-center">Internal</TableHead>
                <TableHead className="text-center">External</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marksData.map((mark) => (
                <TableRow key={mark.subject}>
                  <TableCell className="font-medium">{mark.subject}</TableCell>
                  <TableCell className="text-center">{mark.mid1}</TableCell>
                  <TableCell className="text-center">{mark.mid2}</TableCell>
                  <TableCell className="text-center">{mark.finalInternal.toFixed(1)}</TableCell>
                  <TableCell className="text-center">{mark.external}</TableCell>
                  <TableCell className="text-center font-bold">{mark.total.toFixed(1)}</TableCell>
                  <TableCell className="text-center font-semibold">{mark.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Exam Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} unit="/50" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend />
              <Bar dataKey="Mid-1" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mid-2" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Semester Total" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
