
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...userData } = body;
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';

    let decoded: { email: string, role: string };
    try {
        decoded = verify(token, secret) as { email: string, role: string };
    } catch (err) {
        return NextResponse.json({ message: 'Invalid or expired session token.' }, { status: 400 });
    }

    // The user's email is the reliable identifier from the token.
    const userEmail = decoded.email;
    if (userEmail !== userData.email) {
        return NextResponse.json({ message: 'Token does not match user data.' }, { status: 400 });
    }
    
    const existingUser = users[userEmail];

    if (!existingUser) {
       return NextResponse.json({ message: 'User does not exist. The verification process may have failed.' }, { status: 400 });
    }

    if (!existingUser.isVerified) {
        return NextResponse.json({ message: 'User email not verified. Please complete the email verification step first.'}, { status: 400 });
    }
    
    const updatedUser: User = {
        ...existingUser,
        name: userData.name,
        password: userData.password, // In a real app, hash this password
        // isVerified is already true from the previous step, so we don't need to set it again
        verificationToken: undefined, // Token has been used
        avatarUrl: `https://picsum.photos/seed/${userData.email}/100`, 
    };

    if (userData.role === 'student') {
        updatedUser.studentId = userData.rollNo;
    } else if (userData.role === 'parent') {
        updatedUser.studentId = userData.studentId;
    } else if (userData.role === 'admin') {
        // In a real app, you might assign teacher details differently
    }

    users[userEmail] = updatedUser;
    
    console.log('Signup complete for:', userEmail);

    const { password, ...userToSend } = updatedUser;
    return NextResponse.json({ message: 'Signup successful!', user: userToSend }, { status: 201 });
    
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
