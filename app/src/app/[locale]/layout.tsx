import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Provider } from "jotai";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { locales } from "../../config";
import { useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "meta-data" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RootLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  unstable_setRequestLocale(locale);

  return (
    <html className="dark" lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
