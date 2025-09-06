
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { users } from '@/lib/data';
import type { UserRole } from '@/lib/types';
import sgMail from '@sendgrid/mail';

async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/register/complete?token=${token}`;
    
    // Check if SendGrid API Key and From Email are configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: {
              name: 'EduClarity',
              email: process.env.SENDGRID_FROM_EMAIL, // Use your verified sender
            },
            replyTo: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Verify Your Email for EduClarity',
            html: `
                <h1>Welcome to EduClarity!</h1>
                <p>Please click the link below to verify your email address and complete your registration:</p>
                <a href="${verificationLink}" target="_blank" style="font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; background-color: #79A3B1; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
                <hr>
                <p style="font-size:12px;color:#999;">If you're having trouble with the button, please copy and paste this link into your browser: <br> ${verificationLink}</p>
            `,
        };

        try {
            await sgMail.send(msg);
            console.log('Verification email sent successfully.');
            return { success: true, message: 'Email sent.' };
        } catch (error: any) {
            console.error('SendGrid Error:', error);
            const errorMessage = error.response?.body?.errors[0]?.message || 'Failed to send verification email. Please check server configuration.';
            throw new Error(errorMessage);
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

    // If the user exists and is already verified, block the request.
    if (users[email]?.isVerified) {
      return NextResponse.json({ message: 'This email is already registered and verified.' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const verificationToken = sign({ email, role }, secret, { expiresIn: '1h' });

    // Create or update the user with the new verification token.
    // This handles both new signups and re-attempts for unverified emails.
    users[email] = {
      name: 'New User', // Placeholder name
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
