
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    
    // In a real production app, you would send an email here.
    // For this environment, we'll generate a token and return it
    // so the client can redirect to the completion page directly.
    
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const token = sign({ email, role }, secret, { expiresIn: '1h' });

    // Return the token directly to the client.
    return NextResponse.json({ 
        message: 'Verification token generated.',
        token: token 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Token Generation Error:', error.message);
    return NextResponse.json({ message: error.message || 'An error occurred while generating the verification token.' }, { status: 500 });
  }
}
