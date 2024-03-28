"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { NavbarUserButton } from "./_components/navbar-user-button";
import { NavbarSignInButton } from "./_components/navbar-sign-in-button";
import { NavbarCreateAccountButton } from "./_components/navbar-create-account-button";
import { NavbarWithdrawalButton } from "./_components/navbar-withdrawal-button";
import { NavbarBalance } from "./_components/navbar-balance";
import { NavbarDepositButton } from "./_components/navbar-deposit-button";
import LocaleSwitcher from "../locale-switcher";
import { useSession } from "../auth-provider";
import { FactoLogoText } from "../svgs/facto-logo-text";
import FactoLogo from "../svgs/facto-logo";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const { userInfo } = useSession();

  return (
    <nav className="w-full p-4 dark:bg-background md:h-[153px] md:px-0 md:pt-8">
      <div className="absolute -left-[15%] -top-[35%] hidden size-[531px] rounded-full bg-facto-primary opacity-[18%] blur-3xl md:block" />
      <div className="flex items-center justify-between md:container">
        <div className="z-20 flex items-center gap-12">
          <Link href="/" className="flex items-center justify-start gap-2">
            <FactoLogoText className="hidden md:block" />
            <FactoLogo className="md:hidden" />
          </Link>

          <div className="z-20 hidden gap-4 text-sm font-medium text-disabled-foreground dark:text-muted-foreground md:flex">
            <Link
              className={cn(pathname === "/investments" && "text-primary", "transition-colors")}
              href={`/${locale}/investments`}
            >
              {t("my-investments")}
            </Link>
            <Link
              className={cn(pathname === "/receivables" && "text-primary", "transition-colors")}
              href={`/${locale}/receivables`}
            >
              {t("receivables")}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {!userInfo && <LocaleSwitcher />}
          <NavbarCreateAccountButton />
          <NavbarWithdrawalButton />
          <NavbarDepositButton />
          <NavbarBalance />
          <NavbarUserButton />
          <NavbarSignInButton />
        </div>
      </div>
    </nav>
  );
}
