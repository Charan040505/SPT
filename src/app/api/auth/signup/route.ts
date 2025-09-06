
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...userData } = body;

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
     try {
        const decoded = verify(token, secret) as { email: string, role: string, verificationToken: string };
        if (decoded.email !== userData.email || decoded.verificationToken !== token) {
            return NextResponse.json({ message: 'Token is invalid or does not match.' }, { status: 400 });
        }
    } catch (err) {
         return NextResponse.json({ message: 'Invalid or expired session token.' }, { status: 400 });
    }
    
    if (!users[userData.email] || users[userData.email].verificationToken !== token) {
       return NextResponse.json({ message: 'Invalid verification token or user does not exist.' }, { status: 400 });
    }
    
    const existingUser = users[userData.email];

    const updatedUser: User = {
        ...existingUser,
        name: userData.name,
        password: userData.password, // In a real app, hash this password
        isVerified: true,
        verificationToken: undefined, // Clear the token after verification
        avatarUrl: `https://picsum.photos/seed/${userData.email}/100`, 
    };

    if (userData.role === 'student') {
        updatedUser.studentId = userData.rollNo;
    } else if (userData.role === 'parent') {
        updatedUser.studentId = userData.studentId;
    }

    users[userData.email] = updatedUser;
    
    console.log('Signup complete for:', userData.email);

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
