"use client";

import { useEffect, useState } from 'react';

import localFont from 'next/font/local';
import '@repo/ui/globals.css'; // UI 패키지의 전역 스타일 (CSS 변수 포함)
import './globals.css';
import Providers from './providers';
import LoadingOverlay from '../common/components/LoadingOverlay';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <LoadingOverlay />
          {children}
        </Providers>
      </body>
    </html>
  );
}
