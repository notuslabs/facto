"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
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
import { useAccounts } from "@/hooks/use-accounts";
import { useAuth } from "@/hooks/use-auth";
import { useCreateInvestor } from "@/hooks/use-create-investor";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";

export type NavbarVariant = "investor" | "borrower" | "none";

type NavbarProps = {
  variant?: NavbarVariant;
};

export function Navbar({ variant = "investor" }: NavbarProps) {
  const { login } = useAuth();
  const t = useTranslations("navbar");
  const { data: accounts, isPending: isLoadingAccounts } = useAccounts();
  const { data, isPending: isLoadingSession } = useSession();
  const { mutate: createInvestor, isPending: isCreatingInvestor } = useCreateInvestor();
  const pathname = usePathname();

  const isBorrowerForm = pathname === "/become/borrower";
  const isInvestorForm = pathname === "/become/investor";

  const isLoading = isLoadingSession || isLoadingAccounts || isCreatingInvestor;

  async function handleBecomeInvestor() {
    const solanaWallet = data?.solanaWallet;

    if (!solanaWallet) {
      return;
    }

    if (!data?.userInfo?.name) {
      const accounts = await solanaWallet.requestAccounts();
      const publicKey = new PublicKey(accounts[0]);

      createInvestor(publicKey.toString());
    } else {
      // One of them surely exists here

      let name = data?.userInfo!.name!;

      if (name.length > 30) {
        // try to use first name
        name = name.split(" ")[0];

        // try to use first 30 chars of first name
        if (name.length > 30) {
          name = name.slice(0, 30);
        }
      }

      createInvestor(data?.userInfo?.name!);
    }
  }

  const isLoggedIn = !!data?.userInfo;
  const noInvestorAccount = !isLoading && !accounts?.investorAccount;

  let correctStateVariant: NavbarVariant =
    variant === "borrower"
      ? !!accounts?.borrowerAccount
        ? "borrower"
        : "none"
      : variant === "investor"
        ? !!accounts?.investorAccount
          ? "investor"
          : "none"
        : variant;

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

          {correctStateVariant !== "none" && (
            <div className="z-20 hidden gap-4 text-sm font-medium text-disabled-foreground dark:text-muted-foreground md:flex">
              {correctStateVariant === "borrower" &&
                !!data?.userInfo &&
                accounts?.borrowerAccount &&
                borrowerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex flex-col items-center gap-2 text-center text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

              {correctStateVariant === "investor" &&
                !!data?.userInfo &&
                !!accounts?.investorAccount &&
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
          {(!data?.userInfo || correctStateVariant === "none") && <LocaleSwitcher />}
          {!isLoading && correctStateVariant !== "none" && <NavbarWithdrawalButton />}
          {!isLoading && correctStateVariant !== "none" && <NavbarDepositButton />}
          {!isLoading && correctStateVariant !== "none" && (
            <NavbarBalance variant={correctStateVariant} />
          )}
          {!isLoading &&
            !data?.userInfo &&
            correctStateVariant === "none" &&
            !isBorrowerForm &&
            !isInvestorForm && <NavbarSignInButton />}
          {correctStateVariant === "none" && !isBorrowerForm && !isInvestorForm && !isLoading && (
            <NavbarCreateAccountButton
              text={isLoggedIn && noInvestorAccount ? t("become-investor") : t("create-account")}
              onClick={() => {
                if (isLoggedIn && noInvestorAccount) {
                  handleBecomeInvestor();
                } else {
                  login({ asBorrower: false });
                }
              }}
            />
          )}

          {isLoading && <Loader2 size={16} className="animate-spin" />}

          <NavbarUserButton variant={correctStateVariant} />
        </div>
      </div>
    </nav>
  );
}
