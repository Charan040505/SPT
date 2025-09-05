
'use client'

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Please wait while we verify your email address.');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided. Please use the link from your email.');
            return;
        }

        // Redirect to the complete registration page with the token
        router.replace(`/register/complete?token=${token}`);

    }, [token, router]);

    return (
         <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">
                        {status === 'verifying' && 'Verifying Your Email'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'verifying' && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
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
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
