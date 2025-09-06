
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...userData } = body;

    // 1. Verify the token again to ensure it's still valid
     const secret = process.env.JWT_SECRET || 'your-super-secret-key';
     try {
        const decoded = verify(token, secret) as { email: string };
        if (decoded.email !== userData.email) {
            return NextResponse.json({ message: 'Token email does not match provided email.' }, { status: 400 });
        }
    } catch (err) {
         return NextResponse.json({ message: 'Invalid or expired session token.' }, { status: 400 });
    }

    // In a real app, you would save to a database.
    // For this demo, we'll add the user to our in-memory object.
    const newUser: User = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        // In a real app, you'd handle avatar uploads and associations
        avatarUrl: `https://picsum.photos/seed/${userData.email}/100`, 
    };

    if (userData.role === 'student') {
        newUser.studentId = userData.rollNo;
    } else if (userData.role === 'parent') {
        newUser.studentId = userData.studentId;
    } else if (userData.role === 'admin') {
        // You might have a flow to assign a teacher ID here
    }

    users[userData.email] = newUser;
    console.log('New user added:', users[userData.email]);


    console.log('Signup complete for:', userData.email, 'with role:', userData.role);
    console.log('User data:', userData);

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
