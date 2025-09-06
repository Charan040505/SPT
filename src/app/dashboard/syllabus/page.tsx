
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { syllabusData, users, teachers } from "@/lib/data";
import type { UserRole } from '@/lib/types';
import { Label } from '@/components/ui/label';

function StudentSyllabusView() {
  return (
    <div className="rounded-md border">
      <Table>
          <TableHeader>
          <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Action</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {syllabusData.map((item) => (
              <TableRow key={item.subject}>
              <TableCell className="font-medium">{item.subject}</TableCell>
              <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                      <a href={item.fileUrl} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                      </a>
                  </Button>
              </TableCell>
              </TableRow>
          ))}
          </TableBody>
      </Table>
    </div>
  );
}

function AdminSyllabusView() {
    // In a real app, we'd get the logged-in user's ID. For this demo, we'll use the hardcoded admin user.
    const loggedInAdmin = users['admin@educlarity.com'];
    const teacherDetails = teachers.find(t => t.id === loggedInAdmin.teacherId);
    const teacherSubjects = teachers.filter(t => t.id === loggedInAdmin.teacherId).map(t => t.subject);

    const handleFileUpload = (subject: string) => {
        // In a real app, this would open a file dialog and handle the upload.
        alert(`Uploading syllabus for ${subject}...`);
    }

    return (
        <div className="space-y-4">
             {teacherSubjects.map(subject => {
                const currentSyllabus = syllabusData.find(s => s.subject === subject);
                return (
                    <Card key={subject}>
                        <CardHeader>
                            <CardTitle>{subject}</CardTitle>
                             <CardDescription>
                                {currentSyllabus ? `Current syllabus uploaded. You can replace it below.` : 'No syllabus uploaded yet.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <Label htmlFor={`upload-${subject}`} className="text-sm font-medium">Upload New Syllabus</Label>
                                    <p className="text-xs text-muted-foreground">Please upload the syllabus in PDF format.</p>
                                </div>
                                <Button asChild variant="outline">
                                    <label htmlFor={`upload-${subject}`} className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose File
                                        <input id={`upload-${subject}`} type="file" accept=".pdf" className="sr-only" />
                                    </label>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
             })}
        </div>
    );
}

function SyllabusPageContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as UserRole) || 'student';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {role === 'admin' ? 'Manage Syllabus' : 'Syllabus Downloads'}
          </CardTitle>
          <CardDescription>
            {role === 'admin' 
              ? 'Upload and manage syllabus documents for your subjects.' 
              : 'Download the syllabus for each of your subjects.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
           {role === 'admin' ? <AdminSyllabusView /> : <StudentSyllabusView />}
        </CardContent>
      </Card>
    </div>
  );
}


export default function SyllabusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SyllabusPageContent />
        </Suspense>
    )
}
