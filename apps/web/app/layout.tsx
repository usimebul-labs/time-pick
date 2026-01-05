import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: "Time Pick",
  description: "Time Pick으로 간편하게 일정을 조율하세요.",
  openGraph: {
    title: "Time Pick - 간편한 일정 조율",
    description: "복잡한 일정 조율은 이제 그만! Time Pick으로 쉽고 빠르게 약속을 잡아보세요.",
    siteName: "Time Pick",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Pick - 간편한 일정 조율",
    description: "복잡한 일정 조율은 이제 그만! Time Pick으로 쉽고 빠르게 약속을 잡아보세요.",
  }
};

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
