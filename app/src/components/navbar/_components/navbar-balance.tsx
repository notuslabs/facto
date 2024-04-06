"use client";

import { useFormatNumber } from "@/hooks/number-formatters";
import { useBalance } from "@/hooks/use-get-balance";
import { useSession } from "@/hooks/use-session";
import { Loader2Icon, WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";

type NavbarBalanceProps = {
  variant?: "investor" | "borrower" | "none";
};

export function NavbarBalance({ variant }: NavbarBalanceProps) {
  const formatNumber = useFormatNumber();
  const { data, isPending } = useBalance({ variant });
  const t = useTranslations("navbar");

  if (!data) return null;

  return (
    <span className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <WalletCards size={24} className="text-facto-primary" />
      <div className="flex flex-col">
        <span className="font-regular text-start text-xs text-muted-foreground">
          {t("balance")}
        </span>
        {isPending ? (
          <Loader2Icon className="animate-spin text-facto-primary" size={16} />
        ) : (
          <span>{formatNumber({ value: data?.formattedBalance ?? 0 })}</span>
        )}
      </div>
    </span>
  );
}
