import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authConfig';

/**
 * NextAuth v4 route handler for Next.js App Router.
 * Exporting GET and POST handles all auth sub-routes like:
 * /api/auth/session, /api/auth/providers, /api/auth/csrf, /api/auth/signin, etc.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
