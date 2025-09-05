
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    // In a real app, you would:
    // 1. Find the user associated with the token
    // 2. Check if the token is valid and not expired
    // 3. Mark the user's email as verified in the database
    // 4. Invalidate the token
    console.log(`Verifying email with token: ${token}`);
    
    return NextResponse.json({ message: 'Email verified successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.json({ message: 'Invalid or expired verification link.' }, { status: 400 });
  }
}
