
import { NextResponse } from 'next/server';
import { users } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real app, you would:
    // 1. Find the user by email in your database
    // 2. Compare the hashed password
    // 3. Check if the email is verified
    // 4. Issue a JWT token
    const user = users[email];

    if (user && password === 'password') { // Simplified password check for demo
       return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
    }
    
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}
