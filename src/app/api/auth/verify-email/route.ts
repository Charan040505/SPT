
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import type { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ message: 'Token is required.' }, { status: 400 });
    }
    
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';

    try {
        const decoded = verify(token, secret) as { email: string, role: UserRole, iat: number, exp: number };
        
        // In a real app, you might check if this email is already fully registered and verified.

        return NextResponse.json({ 
            message: 'Email token is valid.',
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
