"use client";

import { useTranslations } from "next-intl";
import { Smile } from "lucide-react";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { NavbarUserButton } from "./_components/navbar-user-button";
import { NavbarSignInButton } from "./_components/navbar-sign-in-button";
import { NavbarCreateAccountButton } from "./_components/navbar-create-account-button";
import { NavbarWithdrawalButton } from "./_components/navbar-withdrawal-button";
import { NavbarBalance } from "./_components/navbar-balance";
import { NavbarDepositButton } from "./_components/navbar-deposit-button";

export function Navbar() {
  const t = useTranslations("navbar");
  const pathname = usePathname();

  return (
    <nav className="w-full bg-background p-4 md:h-[153px] md:pt-8">
      <div className="flex items-center justify-between md:container">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center justify-start gap-2">
            <Smile size={40} />
            <span className="hidden text-xl font-bold md:inline-flex">LOGO</span>
          </Link>

          <div className="hidden gap-4 text-sm font-medium text-muted-foreground md:flex">
            <Link
              className={cn(pathname === "/investments" && "text-primary", "transition-colors")}
              href="/investments"
            >
              {t("my-investments")}
            </Link>
            <Link
              className={cn(pathname === "/receivables" && "text-primary", "transition-colors")}
              href="/receivables"
            >
              {t("receivables")}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
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
