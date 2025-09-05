
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// In a real app, you would use a proper email service
async function sendVerificationEmail(email: string, url: string) {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        console.error("SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is not set. Email not sent.");
        console.log("--- SIMULATED EMAIL ---");
        console.log(`To: ${email}`);
        console.log("Subject: Verify your email for EduClarity");
        console.log("Body:");
        console.log("Please click the link below to verify your email address:");
        console.log(url);
        console.log("--- END SIMULATED EMAIL ---");
        // In a real scenario, you'd want to throw an error or handle this case more gracefully
        // For this demo, we allow it to proceed to show the flow, but in production, this should fail.
        return; 
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Verify your email for EduClarity',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to EduClarity!</h2>
                <p>Please click the button below to verify your email address and complete your registration.</p>
                <a href="${url}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
                <p>If you cannot click the button, please copy and paste this link into your browser:</p>
                <p><a href="${url}">${url}</a></p>
                <p>If you did not request this email, please ignore it.</p>
                <hr />
                <p style="font-size: 0.8em; color: #888;">&copy; ${new Date().getFullYear()} EduClarity. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email with SendGrid', error);
        // Re-throw the error to be caught by the main handler
        throw new Error('Could not send verification email.');
    }
}

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    
    // In a real app, you would:
    // 1. Check if the user already exists and is verified.
    // 2. Potentially rate limit this endpoint.
    
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    const token = sign({ email, role }, secret, { expiresIn: '1h' });

    // Construct the verification URL.
    // In production, you'd use your actual domain from environment variables.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL('/', request.url).toString();
    const url = new URL('/verify-email', baseUrl);
    url.searchParams.set('token', token);


    // Send the email.
    await sendVerificationEmail(email, url.toString());
    
    return NextResponse.json({ message: 'Verification email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Send Verification Error:', error);
    return NextResponse.json({ message: 'An error occurred while sending the verification email.' }, { status: 500 });
  }
}
