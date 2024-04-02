"use client";

import { useBalance } from "@/hooks/use-get-balance";
import { WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarBalance() {
  const { data, isPending } = useBalance();
  const t = useTranslations("navbar");

  if (isPending || !data) return null;

  return (
    <span className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <WalletCards size={24} />
      <div className="flex flex-col">
        <span>$ {data.formattedBalance ?? "0.00"}</span>
        <span className="font-regular text-start text-xs text-muted-foreground">
          {t("balance")}
        </span>
      </div>
    </span>
  );
}
