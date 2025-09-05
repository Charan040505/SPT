
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    // In a real app, you would:
    // 1. Generate a verification token (JWT or OTP)
    // 2. Save the token with the user record, including an expiration time
    // 3. Use an email service (like Nodemailer, SES, SendGrid) to send the email
    console.log(`Sending verification email to: ${email}`);
    
    return NextResponse.json({ message: 'Verification email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Send Verification Error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
