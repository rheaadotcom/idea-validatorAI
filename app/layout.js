import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IdeaValidator AI - Validate Your Startup Idea Instantly',
  description: 'Use the power of AI to analyze your startup ideas with realistic market insights, tech stacks, and risk assessments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="pt-24 pb-12 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
