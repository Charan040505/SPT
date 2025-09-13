
import { NextResponse } from 'next/server';
import { users } from '@/lib/data';
interface User {
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  password: string;
  isVerified: boolean;
  avatarUrl: string;
  studentId?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userData = body;
    
    const userEmail = userData.email;
    
    // Check if user already exists
    if (users[userEmail]) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 });
    }
    
    // Create new user without verification
    const newUser: User = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: userData.password, // In a real app, hash this password
      isVerified: true, // Auto-verify users
      avatarUrl: `https://picsum.photos/seed/${userData.email}/100`, 
    };

    if (userData.role === 'student') {
      newUser.studentId = userData.rollNo;
    } else if (userData.role === 'parent') {
      newUser.studentId = userData.studentId;
    } else if (userData.role === 'admin') {
      // In a real app, you might assign teacher details differently
    }

    users[userEmail] = newUser;
    
    console.log('Signup complete for:', userEmail);

    const { password, ...userToSend } = newUser;
    return NextResponse.json({ message: 'Signup successful!', user: userToSend }, { status: 201 });
    
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup.' }, { status: 500 });
  }
}
