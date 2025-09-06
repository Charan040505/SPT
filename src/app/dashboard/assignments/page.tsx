
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { assignmentsData } from "@/lib/data";
import { format, isPast } from 'date-fns';
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const assignmentsBySubject = assignmentsData.reduce((acc, assignment) => {
    (acc[assignment.subject] = acc[assignment.subject] || []).push(assignment);
    return acc;
  }, {} as Record<string, typeof assignmentsData>);

  const getStatusVariant = (status: 'Pending' | 'Submitted' | 'Late') => {
    if (status === 'Submitted') return 'default';
    if (status === 'Late') return 'destructive';
    return 'secondary';
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
          <CardDescription>
            View and submit your assignments here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(assignmentsBySubject)[0]}>
            {Object.entries(assignmentsBySubject).map(([subject, assignments]) => (
              <AccordionItem value={subject} key={subject}>
                <AccordionTrigger className="text-xl font-headline">{subject}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const isDueDatePast = isPast(new Date(assignment.dueDate));
                      const finalStatus = assignment.status === 'Pending' && isDueDatePast ? 'Late' : assignment.status;
                      
                      return (
                      <Card key={assignment.id} className="p-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <FileText className="h-8 w-8 text-primary mt-1" />
                                <div>
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-semibold">{assignment.title}</h3>
                                         <Badge variant={getStatusVariant(finalStatus)}>{finalStatus}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                                    <p className={cn(
                                        "text-sm font-medium mt-2",
                                        isDueDatePast && finalStatus !== 'Submitted' ? 'text-destructive' : 'text-muted-foreground'
                                    )}>
                                        Due on: {format(new Date(assignment.dueDate), 'PPP')}
                                    </p>
                                </div>
                            </div>
                            {finalStatus !== 'Submitted' && (
                                <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                                    <label htmlFor={`upload-${assignment.id}`} className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Submit Assignment
                                        <input id={`upload-${assignment.id}`} type="file" className="sr-only" />
                                    </label>
                                </Button>
                            )}
                        </div>
                      </Card>
                    )})}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
