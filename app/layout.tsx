import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BELAJAR ALAT UKUR - E-Learning Metrologi 2D/3D",
  description: "Platform E-Learning Metrologi Presisi Interaktif Jangka Sorong & Mikrometer Sekrup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-slate-50 text-slate-900 font-sans">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
