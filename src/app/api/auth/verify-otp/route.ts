import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-utils';
import { users } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, otp, userData } = body;
    
    if (!phoneNumber || !otp) {
      return NextResponse.json({ message: 'Phone number and OTP are required' }, { status: 400 });
    }
    
    // Verify the OTP
    const verificationResult = verifyOTP(phoneNumber, otp);
    
    if (!verificationResult.valid) {
      return NextResponse.json({ 
        message: verificationResult.message, 
        attemptsLeft: verificationResult.attemptsLeft 
      }, { status: 400 });
    }
    
    // OTP is valid
    
    // If userData is provided, create a new user account
    if (userData) {
      const userEmail = userData.email;
      
      // Check if user already exists
      if (users[userEmail]) {
        return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 });
      }
      
      // Create new user with verified phone
      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: userData.password, // In a real app, hash this password
        phoneNumber: phoneNumber,
        isVerified: true,
        avatarUrl: `https://picsum.photos/seed/${userData.email}/100`,
      };
      
      if (userData.role === 'student') {
        (newUser as any).studentId = userData.rollNo;
      } else if (userData.role === 'parent') {
        (newUser as any).studentId = userData.studentId;
      }
      
      users[userEmail] = newUser;
      console.log('User created with verified phone:', userEmail);
      
      const { password, ...userToSend } = newUser;
      return NextResponse.json({ 
        message: 'Phone verified and account created successfully!', 
        user: userToSend 
      }, { status: 201 });
    }
    
    // If no userData, just return success for the verification
    return NextResponse.json({ message: 'Phone number verified successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ message: 'An error occurred during OTP verification.' }, { status: 500 });
  }
}