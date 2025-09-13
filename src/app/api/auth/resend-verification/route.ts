
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { users } from '../../../../../lib/data';
import sgMail from '@sendgrid/mail';

async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/verify-email?token=${token}`;
    
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: {
              name: 'EduClarity Student Performance Tracker',
              email: process.env.SENDGRID_FROM_EMAIL,
            },
            replyTo: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Verify Your EduClarity Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="EduClarity Logo" style="max-width: 200px; margin: 20px 0;">
                    <h1 style="color: #2C3E50; margin-bottom: 20px;">Verify Your Email Address</h1>
                    <p style="color: #34495E; font-size: 16px; line-height: 1.5;">You requested a new verification link for your EduClarity account. Please click the button below to verify your email address:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" target="_blank" style="background-color: #3498DB; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                    </div>
                    
                    <p style="color: #7F8C8D; font-size: 14px;">This verification link will expire in 24 hours for security reasons.</p>
                    
                    <p style="color: #34495E; font-size: 14px;">If you didn't request this email, please ignore it.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #BDC3C7;">
                        <p style="color: #7F8C8D; font-size: 12px;">
                            If the button above doesn't work, copy and paste this link into your browser:<br>
                            <span style="color: #3498DB;">${verificationLink}</span>
                        </p>
                        
                        <p style="color: #7F8C8D; font-size: 12px;">
                            If you don't see the verification email:
                            <ul style="margin: 5px 0;">
                                <li>Check your spam folder</li>
                                <li>Add ${process.env.SENDGRID_FROM_EMAIL} to your contacts</li>
                                <li>Click "Not Spam" if found in spam folder</li>
                            </ul>
                        </p>
                    </div>
                </div>
            `,
            mailSettings: {
                sandboxMode: {
                    enable: process.env.NODE_ENV === 'development'
                }
            }
        };

        try {
            await sgMail.send(msg);
            console.log('Verification email resent successfully.');
            return { success: true, message: 'Email sent.' };
        } catch (error: any) {
            console.error('SendGrid Error:', error);
            const errorMessage = error.response?.body?.errors[0]?.message || 'Failed to send verification email.';
            throw new Error(errorMessage);
        }
    } else {
        console.log("SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set. Skipping email sending.");
        console.log("Verification Link for " + email + ": " + verificationLink);
        return { success: true, message: 'Development mode: Check console for verification link.', verificationLink };
    }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = users[email];
    if (!user) {
      return NextResponse.json({ 
        message: 'No account found with this email address.',
        status: 'not_found'
      }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ 
        message: 'This email is already verified.',
        status: 'already_verified'
      }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const verificationToken = sign(
      { email, role: user.role },
      secret,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Update user with new verification token
    user.verificationToken = verificationToken;
    
    const emailResult = await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ 
      message: 'New verification email sent successfully. Please check your inbox and spam folder.',
      status: 'sent',
      verificationLink: process.env.NODE_ENV === 'development' ? emailResult.verificationLink : undefined
    }, { status: 200 });

  } catch (error: any) {
    console.error('Resend Verification Error:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to resend verification email.',
      status: 'error'
    }, { status: 500 });
  }
}
