

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IdeaValidator AI — Enterprise AI Startup Idea Intelligence Platform',
  description: 'Validate startup ideas in seconds with AI‑powered market sizing, competitor mapping, SWOT analysis, and automated 10‑slide pitch deck generation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-dark-bg text-dark-text`}>
        <Providers>
          <Navbar />
          {/* Main content */}
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12141d',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
