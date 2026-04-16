import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'AI Crypto Research Copilot',
  description:
    'Get instant AI-powered analysis on any crypto token — risk score, tokenomics, sentiment, and final verdict.',
  keywords: ['crypto', 'ai', 'research', 'bitcoin', 'ethereum', 'token analysis'],
  openGraph: {
    title: 'AI Crypto Research Copilot',
    description: 'AI-powered crypto token analysis in seconds.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-bg-base text-slate-100 antialiased">
          <div className="bg-grid min-h-screen">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
