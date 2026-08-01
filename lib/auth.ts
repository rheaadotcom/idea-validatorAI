import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Session } from 'next-auth';

/**
 * Hash a plain‑text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain‑text password with a hashed password.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Retrieve the current session on the server side.
 */
export async function getAuthSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch (e) {
    console.error('[Auth] getServerSession error:', (e as any)?.message);
    return null;
  }
}
