import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nerds.sg'),
  title: 'NERDS — Design & Technology, Singapore',
  description: 'An independent design and technology practice for ambitious people and useful ideas.',
  openGraph: { title: 'NERDS — We make digital things make sense.', description: 'Independent design and technology practice. Singapore / online.', type: 'website', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'NERDS — We make digital things make sense.', description: 'Independent design and technology practice. Singapore / online.', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
