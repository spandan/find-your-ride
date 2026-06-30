import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_NAME, APP_TAGLINE, APP_LOGO_PATH } from "@/lib/branding";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
  icons: {
    icon: APP_LOGO_PATH,
    shortcut: APP_LOGO_PATH,
    apple: APP_LOGO_PATH,
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full min-h-dvh overflow-hidden overscroll-none bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
