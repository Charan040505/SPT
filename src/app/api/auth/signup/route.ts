
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

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

    // In a real app, you would:
    // 2. Validate the rest of the user data (name, password strength, etc.)
    // 3. Hash the password (e.g., with bcrypt)
    // 4. Save the new user and their role-specific data to your database tables.
    // 5. Mark the user's email as verified.

    console.log('Signup complete for:', userData.email, 'with role:', userData.role);
    console.log('User data:', userData);

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
