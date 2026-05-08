import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projex",
  description: "Gérez vos projets et étapes directement depuis votre terminal.",
};

const locales = ["fr", "en"];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // ← await ici

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
          <ModalProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
