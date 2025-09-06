
import { NextResponse } from 'next/server';
import { users } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = users[email];

    // For new users, we don't have a password stored, so we accept any for this demo.
    // For existing demo users, we check against "password".
    const passwordIsValid = user && (user.password ? password === user.password : true);


    if (user && passwordIsValid) {
       // In a real app, you would issue a JWT token here and not send the password back.
       const { password, ...userToSend } = user;
       return NextResponse.json({ message: 'Login successful', user: userToSend }, { status: 200 });
    }
    
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}
