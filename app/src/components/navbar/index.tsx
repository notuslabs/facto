"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
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

type NavbarProps = {
  variant?: "investor" | "borrower" | "none";
};

export function Navbar({ variant = "investor" }: NavbarProps) {
  const t = useTranslations("navbar");
  const { data } = useSession();

  const borrowerLinks = [
    {
      label: t("my-offers"),
      href: "/my-offers" as const,
    },
    {
      label: t("installments"),
      href: "/admin/installments" as const,
    },
  ];

  const investorLinks = [
    {
      label: t("my-investments"),
      href: "/investments" as const,
    },
    {
      label: t("receivables"),
      href: "/receivables" as const,
    },
    {
      label: t("transactions"),
      href: "/transactions" as const,
    },
  ];

  return (
    <nav className="relative w-full py-4 dark:bg-background md:h-[153px] md:pt-8">
      <div className="absolute -left-[15%] -top-[225%] hidden size-[531px] rounded-full bg-facto-primary opacity-[18%] blur-3xl md:block 2xl:left-0" />
      <div className="container flex items-center justify-between">
        <div className="z-20 flex items-center gap-12">
          <Link href="/" className="flex items-center justify-start gap-2">
            <FactoLogoText className="hidden md:block" />
            <FactoLogo className="md:hidden" />
          </Link>

          {variant !== "none" && (
            <div className="z-20 hidden gap-4 text-sm font-medium text-disabled-foreground dark:text-muted-foreground md:flex">
              {variant === "borrower" &&
                !!data?.userInfo &&
                borrowerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex flex-col items-center gap-2 text-center text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

              {variant === "investor" &&
                !!data?.userInfo &&
                investorLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex flex-col items-center gap-2 text-center text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          {!data?.userInfo || (variant === "none" && <LocaleSwitcher />)}
          {variant !== "none" && (
            <>
              <NavbarWithdrawalButton />
              <NavbarDepositButton />
              <NavbarBalance variant={variant} />
              <NavbarUserButton variant={variant} />
              <NavbarSignInButton />
              <NavbarCreateAccountButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
