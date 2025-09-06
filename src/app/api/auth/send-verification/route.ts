
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendVerificationEmail(email: string, url: string) {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        const errorMessage = "Email service is not configured. SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is not set.";
        console.error(errorMessage);
        // In a real production environment, you should throw an error to prevent signup flow from proceeding.
        // For development, we can log to the console and simulate success.
        console.log("--- SIMULATED EMAIL ---");
        console.log(`To: ${email}`);
        console.log("Subject: Verify your email for EduClarity");
        console.log("Body: Please click the link below to verify your email address:");
        console.log(url);
        console.log("--- END SIMULATED EMAIL ---");
        // To avoid breaking the flow in dev when keys are not set, we won't throw an error here.
        // In a live app, this should be: throw new Error(errorMessage);
        return;
    }

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // This must be a verified sender in your SendGrid account
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
        console.log(`Verification email sent successfully to ${email}`);
    } catch (error: any) {
        console.error('Error sending verification email with SendGrid:', JSON.stringify(error, null, 2));
        // Provide a more user-friendly error message
        throw new Error('Could not send verification email. Please ensure the sender email is verified in SendGrid.');
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
  } catch (error: any) {
    console.error('Send Verification Error:', error.message);
    return NextResponse.json({ message: error.message || 'An error occurred while sending the verification email.' }, { status: 500 });
  }
}
