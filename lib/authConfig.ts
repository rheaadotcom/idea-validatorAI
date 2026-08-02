import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { getMongoClient } from '@/lib/mongodb';

// Dynamic import helpers — avoids pulling Mongoose/DB into the type-check
// bundle and keeps the module graph clean.
async function getDbConnect() {
  const mod = await import('@/lib/db');
  return mod.default as () => Promise<unknown>;
}

async function getUserModel() {
  const mod = await import('@/models/User');
  return mod.default as {
    findOne(query: Record<string, unknown>): {
      select(fields: string): Promise<{
        _id: unknown;
        email: string;
        name: string;
        password: string;
      } | null>;
    };
  };
}

/**
 * NextAuth v4 configuration.
 *
 * Typed as `AuthOptions` so TypeScript correctly narrows `session.strategy`
 * to the `SessionStrategy` literal union ("jwt" | "database") instead of
 * widening it to `string`.
 */
export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(getMongoClient()),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const dbConnect = await getDbConnect();
        await dbConnect();

        const User = await getUserModel();
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return { id: String(user._id), email: user.email, name: user.name };
      },
    }),
  ],

  session: {
    // `as const` is redundant when the object is already typed as AuthOptions,
    // but it serves as a reminder that this MUST be a literal, not a string.
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET ?? 'fallback_secret_for_dev',
};
