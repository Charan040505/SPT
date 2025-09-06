
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json() as { email: string, role: UserRole };

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const verificationToken = sign({ email, role }, secret, { expiresIn: '1h' });

    // Store the token with a temporary user object so we can find it later
    // In a real DB, you'd save this to the user's record
    users[email] = {
      ...users[email],
      email,
      role,
      isVerified: false,
      verificationToken: verificationToken,
    };
    
    // In this simulated environment, instead of sending an email,
    // we return the token directly to the client.
    return NextResponse.json({ 
        message: 'Verification token generated successfully.',
        token: verificationToken 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Token Generation Error:', error);
    return NextResponse.json({ message: 'An error occurred while generating the verification token.' }, { status: 500 });
  }
}
