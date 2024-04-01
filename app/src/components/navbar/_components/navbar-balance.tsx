"use client";

import { useSession } from "@/components/auth-provider";
import { useBalance } from "@/hooks/use-get-balance";
import { formatNumber } from "@/lib/format-number";
import { LoaderIcon, WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarBalance() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");
  const { balance, isLoading } = useBalance();

  if (!userInfo) return null;

  return (
    <span className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <WalletCards size={24} className="text-facto-primary" />
      <div className="flex flex-col">
        <span className="font-regular text-start text-xs text-muted-foreground">
          {t("balance")}
        </span>
        {isLoading && <LoaderIcon className="animate-spin text-facto-primary" size={16} />}
        {!isLoading && <span>{formatNumber(balance ?? 0)}</span>}
      </div>
    </span>
  );
}
