import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/modals/ModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projex",
  description: "Gérez vos projets et étapes directement depuis votre terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}
