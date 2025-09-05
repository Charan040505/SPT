// src/ai/flows/personalized-study-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized study recommendations for students.
 *
 * The flow takes student performance data as input and returns tailored study recommendations.
 * @param {StudentPerformanceInput} input - The input data containing student performance details.
 * @returns {Promise<StudentStudyRecommendations>} - A promise resolving to an object containing personalized study recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentPerformanceInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  subject: z.string().describe('The subject for which performance is being evaluated.'),
  marks: z.number().describe('The marks obtained by the student in the subject.'),
  attendancePercentage: z.number().describe('The attendance percentage of the student in the subject.'),
  overallPercentage: z.number().describe('The overall percentage of the student.'),
  rankInClass: z.number().describe('The rank of the student in the class.'),
});

export type StudentPerformanceInput = z.infer<typeof StudentPerformanceInputSchema>;

const StudentStudyRecommendationsSchema = z.object({
  recommendations: z.string().describe('Personalized study recommendations for the student.'),
});

export type StudentStudyRecommendations = z.infer<typeof StudentStudyRecommendationsSchema>;

export async function generatePersonalizedRecommendations(
  input: StudentPerformanceInput
): Promise<StudentStudyRecommendations> {
  return personalizedStudyRecommendationsFlow(input);
}

const personalizedStudyRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedStudyRecommendationsPrompt',
  input: {schema: StudentPerformanceInputSchema},
  output: {schema: StudentStudyRecommendationsSchema},
  prompt: `Based on the student's performance data, provide personalized study recommendations for {{studentName}} in {{subject}}.

Student Performance Data:
- Marks: {{marks}}
- Attendance Percentage: {{attendancePercentage}}%
- Overall Percentage: {{overallPercentage}}%
- Rank in Class: {{rankInClass}}

Recommendations:`,
});

const personalizedStudyRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedStudyRecommendationsFlow',
    inputSchema: StudentPerformanceInputSchema,
    outputSchema: StudentStudyRecommendationsSchema,
  },
  async input => {
    const {output} = await personalizedStudyRecommendationsPrompt(input);
    return output!;
  }
);
