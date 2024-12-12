import type { Metadata } from "next";
import "@/styles/globals.css";
import { NextIntlClientProvider, useMessages, useLocale } from 'next-intl';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OmniQuery",
  description: "AI-powered intelligent search",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  //const locale = params.locale;
  const locale = useLocale();
  const messages = useMessages();

  return (
    <html>
      <body className={`antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
