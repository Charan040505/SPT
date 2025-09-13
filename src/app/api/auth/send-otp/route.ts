import { NextResponse } from 'next/server';
import { users } from '@/lib/data';
import { storeOTP } from '@/lib/otp-utils';

// In a production environment, use a proper SMS service like Twilio
// This is a mock implementation for demonstration purposes

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, role } = body;
    
    if (!phoneNumber) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }
    
    // Generate and store a new OTP with 2-minute expiration
    const otp = storeOTP(phoneNumber, 2);
    
    // In a real implementation, send SMS here
    console.log(`Sending OTP ${otp} to ${phoneNumber} for ${role} verification`);
    
    // For development, return the OTP in the response
    // In production, this should only return success status
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({ 
      message: 'OTP sent successfully',
      otp: isDevelopment ? otp : undefined,
      expiresIn: '2 minutes'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ message: 'An error occurred while sending OTP.' }, { status: 500 });
  }
}