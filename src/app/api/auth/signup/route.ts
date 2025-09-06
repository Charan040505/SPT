
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
        const decoded = verify(token, secret) as { email: string, role: string };
        if (decoded.email !== userData.email) {
            return NextResponse.json({ message: 'Token does not match user data.' }, { status: 400 });
        }
    } catch (err) {
         return NextResponse.json({ message: 'Invalid or expired session token.' }, { status: 400 });
    }
    
    const userToVerify = Object.values(users).find(u => u.verificationToken === token);

    if (!userToVerify || userToVerify.email !== userData.email) {
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
    } else if (userData.role === 'admin') {
        // In a real app, you might assign teacher details differently
    }


    users[userData.email] = updatedUser;
    
    console.log('Signup complete for:', userData.email);

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
