"use client";

import Link from "next/link";
import { NavbarSignInButton } from "./navbar-sign-in-button";
import { NavbarUserButton } from "./navbar-user-button";
import LocaleSwitcher from "../locale-switcher";
import { useLocale, useTranslations } from "next-intl";
import { Smile } from "lucide-react";
import { usePathname } from "@/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="h-[153px] w-full pt-8 dark:bg-background">
      <div className="container flex h-10 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center justify-start gap-2">
            <Smile size={40} />
            <span className="text-4xl font-bold">LOGO</span>
          </Link>
          <div className="flex gap-4 text-disabled-foreground  dark:text-muted-foreground">
            <Link
              className={cn(pathname === "/investments" ? "text-primary" : "", "transition-colors")}
              href={`/${locale}/investments`}
            >
              {t("my-investments")}
            </Link>
            <Link
              className={cn(pathname === "/receivables" ? "text-primary" : "", "transition-colors")}
              href={`/${locale}/receivables`}
            >
              {t("receivables")}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-8">
          <LocaleSwitcher />
          <NavbarUserButton />
          <NavbarSignInButton />
        </div>
      </div>
    </nav>
  );
}
