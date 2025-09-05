"use client";

import { useState, useTransition } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  generatePersonalizedRecommendations,
  type StudentPerformanceInput,
  type StudentStudyRecommendations,
} from "@/ai/flows/personalized-study-recommendations";
import type { Student } from "@/lib/types";

export default function PersonalizedRecommendations({ student }: { student: Student }) {
  const [isPending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<StudentStudyRecommendations | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = () => {
    const studentPerformance: StudentPerformanceInput = {
      studentName: student.name,
      subject: "Overall",
      marks: student.overallPercentage,
      attendancePercentage: student.attendance,
      overallPercentage: student.overallPercentage,
      rankInClass: student.rank,
    };

    startTransition(async () => {
      setError(null);
      try {
        const result = await generatePersonalizedRecommendations(studentPerformance);
        setRecommendation(result);
      } catch (e) {
        console.error(e);
        setError("Failed to generate recommendations. Please try again.");
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Personalized Insights</CardTitle>
        <CardDescription>
          Get AI-powered recommendations to boost your learning.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow items-center justify-center space-y-4">
        {isPending ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Generating your insights...</p>
          </div>
        ) : recommendation ? (
          <div className="text-sm text-center bg-accent/20 p-4 rounded-lg">
            <p className="font-semibold text-accent-foreground mb-2">Here is your tailored advice:</p>
            <p className="text-accent-foreground/80">{recommendation.recommendations}</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground space-y-2">
            <Lightbulb className="h-10 w-10 mx-auto text-accent" />
            <p>Ready to discover your path to success?</p>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        
        <div className="pt-4 mt-auto w-full">
            <Button onClick={handleGetRecommendation} disabled={isPending} className="w-full">
              {isPending ? "Analyzing..." : recommendation ? "Regenerate Tips" : "Get Study Tips"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
