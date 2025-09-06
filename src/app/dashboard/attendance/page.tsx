
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Check, Users } from "lucide-react";
import { format } from "date-fns";
import { students } from "@/lib/data";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "leave";

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    students.reduce((acc, student) => ({ ...acc, [student.id]: "present" }), {})
  );

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
  
  const getStatusColor = (status: AttendanceStatus) => {
      switch (status) {
          case 'present': return 'text-green-600';
          case 'absent': return 'text-red-600';
          case 'leave': return 'text-yellow-600';
          default: return '';
      }
  }

  const studentsInClass = students; // Simplified for now

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Attendance</CardTitle>
          <CardDescription>
            Select a class and date to mark student attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="flex-1 w-full">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10A">Grade 10 - Section A</SelectItem>
                  <SelectItem value="10B">Grade 10 - Section B</SelectItem>
                  <SelectItem value="11A">Grade 11 - Section A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4"/> Student
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInClass.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.rollNo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <RadioGroup
                        value={attendance[student.id]}
                        onValueChange={(value) => handleStatusChange(student.id, value as AttendanceStatus)}
                        className="flex justify-end gap-2 md:gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`} className="text-green-600 font-medium cursor-pointer">Present</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`} className="text-red-600 font-medium cursor-pointer">Absent</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                          <RadioGroupItem value="leave" id={`leave-${student.id}`} />
                          <Label htmlFor={`leave-${student.id}`} className="text-yellow-600 font-medium cursor-pointer">Leave</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-6">
              <Button>
                  <Check className="mr-2 h-4 w-4" />
                  Save Attendance
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
