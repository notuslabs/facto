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
