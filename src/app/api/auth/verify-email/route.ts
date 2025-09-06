
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { UserRole, User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ message: 'Token is required.' }, { status: 400 });
    }
    
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';

    try {
        const decoded = verify(token, secret) as { email: string, role: UserRole };
        
        // Find user by token, not by email, as the token is the verifiable credential
        const user = Object.values(users).find(u => u.verificationToken === token);

        if (!user || user.email !== decoded.email) {
            return NextResponse.json({ message: 'Invalid verification token.' }, { status: 400 });
        }
        
        if (user.isVerified) {
            return NextResponse.json({ message: 'Email is already verified.' }, { status: 200 });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = undefined; // Token has been used

        return NextResponse.json({ 
            message: 'Email successfully verified.',
            email: decoded.email,
            role: decoded.role 
        }, { status: 200 });

    } catch (err) {
         return NextResponse.json({ message: 'Invalid or expired verification link.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
