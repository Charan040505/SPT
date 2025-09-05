
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'admin', 'parent']),
});

const studentSchema = baseSchema.extend({
  role: z.literal('student'),
  class: z.string().min(1, 'Class/Section is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
});

const teacherSchema = baseSchema.extend({
  role: z.literal('admin'),
  subjects: z.string().min(1, 'Subject(s) is required'),
});

const parentSchema = baseSchema.extend({
    role: z.literal('parent'),
    studentId: z.string().min(1, "Child's Roll No./ID is required"),
});

const formSchema = z.discriminatedUnion('role', [
  studentSchema,
  teacherSchema,
  parentSchema,
]);

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'student',
      name: '',
      email: '',
      password: '',
      class: '',
      rollNo: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log('Form submitted', data);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account Created!",
        description: "You have successfully signed up. Please log in.",
      });
      router.push('/login');

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    const newRole = value as UserRole;
    setRole(newRole);
    form.setValue('role', newRole);
    // Reset role-specific fields when role changes
    if (newRole === 'student') {
        form.reset({ ...form.getValues(), role: 'student', subjects: undefined, studentId: undefined });
    } else if (newRole === 'admin') {
        form.reset({ ...form.getValues(), role: 'admin', class: undefined, rollNo: undefined, studentId: undefined });
    } else if (newRole === 'parent') {
        form.reset({ ...form.getValues(), role: 'parent', class: undefined, rollNo: undefined, subjects: undefined });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join EduClarity and start your journey towards academic excellence.
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value as UserRole);
                        handleRoleChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin/Teacher</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
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
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
