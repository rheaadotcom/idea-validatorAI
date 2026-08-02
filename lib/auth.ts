import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authConfig';
import type { Session } from 'next-auth';

/**
 * Hash a plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain-text password with a hashed password.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Retrieve the current session on the server side.
 *
 * `authOptions` is typed as `AuthOptions` in lib/authConfig.ts, so
 * `session.strategy` is `SessionStrategy` (not `string`) and
 * `getServerSession(authOptions)` type-checks correctly.
 */
export async function getAuthSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[Auth] getServerSession error:', message);
    return null;
  }
}
