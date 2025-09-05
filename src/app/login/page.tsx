'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/logo';
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('admin');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd perform authentication here
    router.push(`/dashboard?role=${role}`);
  };

  const LoginForm = ({ currentRole }: { currentRole: UserRole }) => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${currentRole}-email`}>Email</Label>
        <Input
          id={`${currentRole}-email`}
          type="email"
          placeholder="m@example.com"
          required
          defaultValue={`${currentRole}@educlarity.com`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${currentRole}-password`}>Password</Label>
        <Input
          id={`${currentRole}-password`}
          type="password"
          required
          defaultValue="password"
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
          <CardDescription>
            Select your role and sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="admin"
            className="w-full"
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="parent">Parent</TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <LoginForm currentRole="admin" />
            </TabsContent>
            <TabsContent value="student">
              <LoginForm currentRole="student" />
            </TabsContent>
            <TabsContent value="parent">
              <LoginForm currentRole="parent" />
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
