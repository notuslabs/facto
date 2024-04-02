"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { NavbarUserButton } from "./_components/navbar-user-button";
import { NavbarSignInButton } from "./_components/navbar-sign-in-button";
import { NavbarCreateAccountButton } from "./_components/navbar-create-account-button";
import { NavbarWithdrawalButton } from "./_components/navbar-withdrawal-button";
import { NavbarBalance } from "./_components/navbar-balance";
import { NavbarDepositButton } from "./_components/navbar-deposit-button";
import LocaleSwitcher from "../locale-switcher";
import { FactoLogoText } from "../svgs/facto-logo-text";
import FactoLogo from "../svgs/facto-logo";
import { useSession } from "@/hooks/use-session";

export function Navbar() {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <nav className="relative w-full p-4 dark:bg-background md:h-[153px] md:px-0 md:pt-8">
      <div className="absolute -left-[15%] -top-[225%] hidden size-[531px] rounded-full bg-facto-primary opacity-[18%] blur-3xl md:block 2xl:left-0" />
      <div className="flex items-center justify-between md:container">
        <div className="z-20 flex items-center gap-12">
          <Link href="/" className="flex items-center justify-start gap-2">
            <FactoLogoText className="hidden md:block" />
            <FactoLogo className="md:hidden" />
          </Link>

          <div className="z-20 hidden gap-4 text-sm font-medium text-disabled-foreground dark:text-muted-foreground md:flex">
            <Link
              className={cn(
                pathname.startsWith("/investments") &&
                  "border-facto-primary text-facto-primary underline decoration-facto-primary decoration-[3px] underline-offset-8",
                "transition-colors",
              )}
              href="/investments"
            >
              {t("my-investments")}
            </Link>
            <Link
              className={cn(
                pathname.startsWith("/receivables") &&
                  "border-facto-primary text-facto-primary underline decoration-facto-primary decoration-[3px] underline-offset-8",
                "transition-colors",
              )}
              href="/receivables"
            >
              {t("receivables")}
            </Link>

            {/* This is only for testing. In prod, the transaction route is mobile only, so no need for this navbar link, it will use the button modals */}
            <Link
              className={cn(
                pathname.startsWith("/transactions") &&
                  "border-facto-primary text-facto-primary underline decoration-facto-primary decoration-[3px] underline-offset-8",
                "transition-colors",
              )}
              href="/transactions"
            >
              {t("transactions")}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {!data?.userInfo && <LocaleSwitcher />}
          <NavbarWithdrawalButton />
          <NavbarDepositButton />
          <NavbarBalance />
          <NavbarUserButton />
          <NavbarSignInButton />
          <NavbarCreateAccountButton />
        </div>
      </div>
    </nav>
  );
}
