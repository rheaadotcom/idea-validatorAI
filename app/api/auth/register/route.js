import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('[REGISTER] DB connection error:', dbError?.message);
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable. Please try again.' },
        { status: 200 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, user: { id: user._id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER] Unhandled error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 200 }
    );
  }
}
