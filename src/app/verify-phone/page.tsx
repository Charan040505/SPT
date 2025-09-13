'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import { Loader2, CheckCircle } from 'lucide-react';

export default function VerifyPhonePage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  
  // Get phone number and user data from URL params
  const phoneNumber = searchParams.get('phone');
  const userData = searchParams.get('userData') ? JSON.parse(decodeURIComponent(searchParams.get('userData') || '{}')) : null;
  
  // Start countdown timer
  useEffect(() => {
    if (countdown > 0 && !isVerified) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVerified]);
  
  // Format countdown as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleVerify = async () => {
    if (!phoneNumber || !otp) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Phone number and OTP are required.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, userData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        throw new Error(data.message || 'Verification failed');
      }
      
      setIsVerified(true);
      toast({
        title: "Verification Successful",
        description: userData ? "Your account has been created successfully." : "Your phone number has been verified.",
      });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "There was a problem verifying your phone number.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, role: userData?.role || 'student' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      // Reset countdown and attempts
      setCountdown(120);
      setAttemptsLeft(3);
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone number.",
      });
      
      // For development, show OTP in toast
      if (data.otp) {
        toast({
          title: "Development Mode",
          description: `OTP: ${data.otp}`,
        });
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend OTP",
        description: error.message || "There was a problem sending the OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If no phone number is provided, show error
  if (!phoneNumber) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <Logo className="h-10 w-10 mb-2" />
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
            <CardDescription>
              No phone number provided. Please go back and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push('/register')}
            >
              Back to Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Logo className="h-10 w-10 mb-2" />
          <CardTitle className="text-2xl font-bold">
            {isVerified ? 'Phone Verified' : 'Verify Your Phone'}
          </CardTitle>
          <CardDescription>
            {isVerified 
              ? 'Your phone number has been verified successfully.' 
              : `Enter the OTP sent to ${phoneNumber}. Time remaining: ${formatTime(countdown)}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-sm text-muted-foreground">
                {userData 
                  ? 'Your account has been created successfully. Redirecting to login...' 
                  : 'Your phone number has been verified. Redirecting...'}
              </p>
            </div>
          ) : (
            <>
              {countdown > 0 ? (
                <>
                  <div className="space-y-2">
                    <Input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    {attemptsLeft < 3 && (
                      <p className="text-sm text-amber-500">
                        {attemptsLeft} attempts remaining
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleVerify}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={handleResendOTP}
                      disabled={isLoading || countdown > 90} // Allow resend after 30 seconds
                    >
                      Resend OTP
                      {countdown > 90 && ` (${formatTime(countdown - 90)})`}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-amber-500">
                    OTP has expired. Please request a new one.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Resend OTP'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}