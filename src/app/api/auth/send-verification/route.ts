
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// In a real app, you would use a proper email service
function sendVerificationEmail(email: string, url: string) {
    console.log('---');
    console.log(`To: ${email}`);
    console.log('Subject: Verify your email for EduClarity');
    console.log('Body:');
    console.log('Please click the link below to verify your email address:');
    console.log(url);
    console.log('---');
}

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    
    // In a real app, you would:
    // 1. Check if the user already exists and is verified.
    // 2. Potentially rate limit this endpoint.
    
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const token = sign({ email, role }, secret, { expiresIn: '1h' });

    // Construct the verification URL.
    const url = new URL('/verify-email', request.url);
    url.searchParams.set('token', token);

    // Send the email.
    sendVerificationEmail(email, url.toString());
    
    return NextResponse.json({ message: 'Verification email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Send Verification Error:', error);
    return NextResponse.json({ message: 'An error occurred while sending the verification email.' }, { status: 500 });
  }
}
