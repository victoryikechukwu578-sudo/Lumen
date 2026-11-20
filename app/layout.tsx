import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/ui/providers";
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumen - AI Powered Web App Builder",
  description:
   "Lumen is an AI-Powered Web App Builder that allows you to create stunning web applications effortlessly with its intuitive interface and powerful AI capabilities, you can bring your ideas to life in no time whether you are a developer or a non-technical user, Lumen provides the tools you need to build and develop your web apps with ease.",
};

export const instant = false;

export default function RootLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
        <Providers>{children}</Providers>
    </body>
    </html>
  </ClerkProvider>
  );
}
