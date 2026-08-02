import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authConfig';

/**
 * NextAuth v4 route handler for the App Router.
 * authOptions is defined and typed in lib/authConfig.ts —
 * keeping the single source of truth in TypeScript ensures
 * session.strategy resolves as SessionStrategy, not string.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
