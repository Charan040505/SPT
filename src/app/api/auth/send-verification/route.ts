
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { UserRole } from '@/lib/types';
import sgMail from '@sendgrid/mail';

async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/complete?token=${token}`;
    
    // Check if SendGrid API Key and From Email are configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL, // Use a verified sender
            subject: 'Verify Your Email for EduClarity',
            html: `
                <h1>Welcome to EduClarity!</h1>
                <p>Please click the link below to verify your email address and complete your registration:</p>
                <a href="${verificationLink}" target="_blank">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        try {
            await sgMail.send(msg);
            console.log('Verification email sent successfully.');
            return { success: true, message: 'Email sent.' };
        } catch (error: any) {
            console.error('SendGrid Error:', error.response?.body || error.message);
            // This error often means the "from" email is not verified in SendGrid.
            throw new Error('Failed to send verification email. Please check server configuration.');
        }
    } else {
        // Fallback for local development if SendGrid is not configured
        console.log("SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set. Skipping email sending.");
        console.log("Verification Link for " + email + ": " + verificationLink);
        return { success: true, message: 'Simulation mode. See console for verification link.', verificationLink };
    }
}


export async function POST(request: Request) {
  try {
    const { email, role } = await request.json() as { email: string, role: UserRole };

    if (users[email]?.isVerified) {
      return NextResponse.json({ message: 'This email is already registered and verified.' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const verificationToken = sign({ email, role }, secret, { expiresIn: '1h' });

    // Store the token with a temporary user object so we can find it later
    // In a real DB, you'd save this to the user's record
    users[email] = {
      ...users[email],
      name: 'New User',
      email,
      role,
      isVerified: false,
      verificationToken: verificationToken,
    };
    
    const emailResult = await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ 
        message: 'Verification email sent successfully. Please check your inbox.',
        // For local dev, we might get the link back
        verificationLink: emailResult.verificationLink,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Token Generation Error:', error);
    return NextResponse.json({ message: error.message || 'An error occurred while generating the verification token.' }, { status: 500 });
  }
}

