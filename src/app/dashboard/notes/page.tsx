
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { notesData } from "@/lib/data";
import { format } from 'date-fns';

export default function NotesPage() {
  const notesBySubject = notesData.reduce((acc, note) => {
    (acc[note.subject] = acc[note.subject] || []).push(note);
    return acc;
  }, {} as Record<string, typeof notesData>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notes & Study Materials</CardTitle>
          <CardDescription>
            Download notes and materials uploaded by your teachers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(notesBySubject)[0]}>
            {Object.entries(notesBySubject).map(([subject, notes]) => (
              <AccordionItem value={subject} key={subject}>
                <AccordionTrigger className="text-xl font-headline">{subject}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <Card key={note.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-semibold">{note.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {note.fileType} &bull; Uploaded on {format(new Date(note.uploadedAt), 'PPP')}
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <a href={note.fileUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </Card>
                    ))}
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
