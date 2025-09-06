
'use client'

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Please wait while we verify your email address.');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided. Please check the link or try registering again.');
            return;
        }

        async function verify() {
             try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed.');
                }
                
                setStatus('success');
                setMessage(data.message);
                
                toast({
                    title: "Email Verified!",
                    description: "You can now log in to your account.",
                });

                // Redirect to login after a short delay
                setTimeout(() => router.push('/login'), 2000);

            } catch (e: any) {
                setStatus('error');
                setMessage(e.message);
            }
        }
        
        verify();

    }, [token, router, toast]);

    return (
         <div className="flex min-h-screen flex-col items-center justify-center p-4">
             <div className="absolute top-8 left-8">
                <Logo />
            </div>
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">
                        {status === 'verifying' && 'Verifying Your Email'}
                        {status === 'success' && 'Verification Successful'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'verifying' && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
                     {status === 'success' && <CheckCircle className="mx-auto h-12 w-12 text-green-500" />}
                    {status === 'error' && (
                        <Button asChild>
                            <Link href="/register">Back to Registration</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
