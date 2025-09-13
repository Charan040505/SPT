'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// Fix import path for test function
import { testPhoneVerification } from '@/app/api/test-phone-verification';
import { useToast } from '@/hooks/use-toast';

export default function TestVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('1234567890');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, role: 'student' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('OTP sent successfully');
        if (data.otp) {
          setSentOtp(data.otp);
          toast.info(`Development OTP: ${data.otp}`);
        }
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('An error occurred while sending OTP');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber, 
          otp,
          userData: {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            studentId: 'S12345'
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Phone verified successfully');
      } else {
        toast.error(data.message || 'Failed to verify OTP');
        if (data.attemptsLeft) {
          toast.info(`Attempts left: ${data.attemptsLeft}`);
        }
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const runAutomatedTest = () => {
    toast.info('Running automated test...');
    testPhoneVerification()
      .then(() => toast.success('Automated test completed'))
      .catch((error) => {
        toast.error('Automated test failed');
        console.error(error);
      });
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Phone Verification Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manual Testing</CardTitle>
            <CardDescription>
              Test the phone verification system manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <Button 
              onClick={handleSendOtp} 
              disabled={loading || !phoneNumber}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
            
            {sentOtp && (
              <div className="p-2 bg-muted rounded text-center">
                <p className="text-sm font-mono">Development OTP: {sentOtp}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
            
            <Button 
              onClick={handleVerifyOtp} 
              disabled={loading || !otp || !phoneNumber}
              className="w-full"
              variant="secondary"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Automated Testing</CardTitle>
            <CardDescription>
              Run automated tests for the phone verification system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will run a series of tests to verify the phone verification system functionality:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Send OTP to test phone number</li>
              <li>Verify valid OTP</li>
              <li>Test invalid OTP handling</li>
              <li>Test OTP expiration</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runAutomatedTest} 
              className="w-full"
              variant="default"
            >
              Run Automated Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}