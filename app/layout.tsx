import './globals.css';
import { Inter } from 'next/font/google';
import { ClientLayout } from './hooks/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Restaurant Table Reservation System',
  description: 'Find and reserve tables at restaurants near you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
