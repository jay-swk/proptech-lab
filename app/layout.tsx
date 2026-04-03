import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ThemeScript } from "@/components/layout/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://jay-swk.github.io/proptech-lab";

export const metadata: Metadata = {
  title: "PropTech Lab — 프롭테크 인터랙티브 학습",
  description:
    "용적률, 건폐율, 대지면적을 직접 조작하며 이해하는 인터랙티브 프롭테크 학습 서비스",
  openGraph: {
    title: "PropTech Lab — 프롭테크 인터랙티브 학습",
    description:
      "용적률 시뮬레이터로 건물 규모를 실시간 계산하고 3D로 확인하세요. 수익성 분석까지.",
    url: siteUrl,
    siteName: "PropTech Lab",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "PropTech Lab — 인터랙티브 프롭테크 학습 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropTech Lab — 프롭테크 인터랙티브 학습",
    description:
      "용적률 시뮬레이터로 건물 규모를 실시간 계산하고 3D로 확인하세요.",
    images: [`${siteUrl}/og-image.svg`],
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
