import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BehördenAssistent - Sozialversicherungsausweis online beantragen',
  description: 'Beantragen Sie Ihren Sozialversicherungsausweis schnell und sicher online. Digitaler Service mit Bezahlfunktion und direkter Zustellung.',
  keywords: 'Sozialversicherungsausweis, Antrag, online, behörde, digital, schnell, sicher',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}