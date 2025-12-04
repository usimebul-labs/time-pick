"use client";

import localFont from 'next/font/local';
import '@repo/ui/globals.css'; // UI 패키지의 전역 스타일 (CSS 변수 포함)
import './globals.css';
import { Stack } from '../stackflow';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout() {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Stack />
      </body>
    </html>
  );
}
