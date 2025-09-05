
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    // In a real app, this would be similar to send-verification:
    // 1. Find the user by email
    // 2. Check if they are already verified
    // 3. Generate and send a new verification email
    console.log(`Resending verification email to: ${email}`);
    
    return NextResponse.json({ message: 'Verification email has been resent.' }, { status: 200 });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
