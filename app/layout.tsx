import type { Metadata } from 'next';
import { Geist, Geist_Mono, Arial } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from 'sonner';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const arial = Arial({
  variable: '--font-arial',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'NearSkill - Product Discovery Platform',
  description: 'Discover useful products, tools, software, courses, and AI tools with honest reviews and comparisons.',
  keywords: 'products, tools, software, courses, AI tools, reviews, comparisons',
  authors: [{ name: 'NearSkill' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nearskill.com',
    title: 'NearSkill - Product Discovery Platform',
    description: 'Discover useful products, tools, software, courses, and AI tools with honest reviews and comparisons.',
    siteName: 'NearSkill',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NearSkill - Product Discovery Platform',
    description: 'Discover useful products, tools, software, courses, and AI tools with honest reviews and comparisons.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${arial.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
