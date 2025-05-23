
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// import { initializeLocalData } from '@/lib/data-store'; // Can be called here if needed globally on mount

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Your personal budgeting and expense tracking companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // One option to ensure data is initialized:
  // React.useEffect(() => {
  //  initializeLocalData();
  // }, []);
  // However, this makes RootLayout a client component.
  // It's often better to let individual pages handle their data loading logic
  // or use a client component wrapper if global initialization on mount is strictly needed.
  // For now, individual pages will load data and fall back to placeholders.

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

