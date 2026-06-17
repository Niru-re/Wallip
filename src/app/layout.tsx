import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Clarity } from "@/components/Clarity";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Free HD & 4K Wallpapers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Clarity />
        <AmbientBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
