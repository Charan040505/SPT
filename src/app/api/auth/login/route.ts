
import { NextResponse } from 'next/server';
import { users } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = users[email];

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Email verification check removed
    
    const passwordIsValid = user.password ? password === user.password : true;

    if (user && passwordIsValid) {
       const { password, ...userToSend } = user;
       return NextResponse.json({ message: 'Login successful', user: userToSend }, { status: 200 });
    }
    
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}
