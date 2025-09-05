
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import type { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const baseSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const studentSchema = baseSchema.extend({
  role: z.literal('student'),
  class: z.string().min(1, 'Class/Section is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
});

const adminSchema = baseSchema.extend({
  role: z.literal('admin'),
  subjects: z.string().min(1, 'Subject(s) is required'),
});

const parentSchema = baseSchema.extend({
    role: z.literal('parent'),
    studentId: z.string().min(1, "Child's Roll No./ID is required"),
});

const formSchema = z.discriminatedUnion('role', [
  studentSchema,
  adminSchema,
  parentSchema,
]);

type FormValues = z.infer<typeof formSchema>;

function CompleteRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError("No verification token found. Please use the link from your email.");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid or expired verification link.');
        }

        setEmail(data.email);
        setRole(data.role);
        form.setValue('role', data.role);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsVerifying(false);
      }
    }
    verifyToken();
  }, [token, form]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, email, token })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed.');
      }
      
      toast({
        title: "Account Created!",
        description: "You have successfully signed up. Please log in.",
      });
      router.push('/login');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isVerifying) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
             <div className="absolute top-8 left-8">
                <Logo />
            </div>
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Verifying...</CardTitle>
                </CardHeader>
                <CardContent>
                   <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                   <p className="mt-4 text-muted-foreground">Please wait while we verify your email.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (error) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
             <div className="absolute top-8 left-8">
                <Logo />
            </div>
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-destructive">Verification Failed</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/register">Go back to registration</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Just a few more details to get you started. Your email is <strong>{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === 'student' && (
                <>
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class/Section</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g. 10A" {...field as any} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rollNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll No.</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g. 21" {...field as any} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {role === 'admin' && (
                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject(s)</FormLabel>
                      <FormControl>
                         <Input placeholder="e.g. Mathematics, Science" {...field as any} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               {role === 'parent' && (
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Roll No./ID</FormLabel>
                      <FormControl>
                         <Input placeholder="e.g. S001" {...field as any} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function CompleteRegistrationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompleteRegistrationForm />
        </Suspense>
    )
}
