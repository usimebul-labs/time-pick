"use client";

import { useEffect, useState } from 'react';

import localFont from 'next/font/local';
import '@repo/ui/globals.css'; // UI 패키지의 전역 스타일 (CSS 변수 포함)
import './globals.css';
import Providers from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
