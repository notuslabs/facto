import "../../globals.css";
import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { locales } from "../../../config";
import { unstable_setRequestLocale } from "next-intl/server";
import MobileExtraNavbar from "@/components/mobile-extra-navbar";
import { RequireAuthProvider } from "@/providers/require-auth-provider";

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
  unstable_setRequestLocale(locale);

  return (
    <RequireAuthProvider>
      <Navbar variant="borrower" />
      {children}
      <MobileExtraNavbar />
    </RequireAuthProvider>
  );
}
