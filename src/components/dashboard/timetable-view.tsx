
"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimetableEntry } from "@/lib/types";
import { Clock } from "lucide-react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekDaysForTabs = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableView({
  timetableData,
}: {
  timetableData: TimetableEntry[];
}) {
  const [currentDay, setCurrentDay] = useState("Monday");

  useEffect(() => {
    const dayIndex = new Date().getDay();
    const today = daysOfWeek[dayIndex];
    if (weekDaysForTabs.includes(today)) {
      setCurrentDay(today);
    }
  }, []);

  const DaySchedule = ({ day }: { day: string }) => {
    const schedule = timetableData.filter((entry) => entry.day === day).sort((a, b) => a.period - b.period);
    
    if (schedule.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                <Clock className="w-12 h-12 mb-4" />
                <p>No classes scheduled for {day}.</p>
            </div>
        )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Period</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((entry) => (
            <TableRow key={entry.period}>
              <TableCell className="font-medium">{entry.period}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>{entry.teacher}</TableCell>
              <TableCell className="text-right">
                {entry.startTime} - {entry.endTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Weekly Timetable</CardTitle>
        <CardDescription>Your class schedule for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentDay} value={currentDay} onValueChange={setCurrentDay} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {weekDaysForTabs.map(day => (
                 <TabsTrigger key={day} value={day}>{day.substring(0,3)}</TabsTrigger>
            ))}
          </TabsList>
          {weekDaysForTabs.map(day => (
             <TabsContent key={day} value={day}>
                <Card>
                    <CardContent className="p-2 md:p-6">
                        <DaySchedule day={day} />
                    </CardContent>
                </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
