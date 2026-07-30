import './globals.css';
import AppProviders from '@/providers/AppProviders';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
// import { ensureIAdminUser } from '@/lib/firebase/seed-admin';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ensureIAdminUser();
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
