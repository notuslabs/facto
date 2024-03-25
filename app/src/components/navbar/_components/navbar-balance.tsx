"use client";

import { useSession } from "@/components/auth-provider";
import { WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarBalance() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");
  const totalBalance = "42.190,11";

  if (!userInfo) return null;

  return (
    <span className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <WalletCards size={24} />
      <div className="flex flex-col">
        <span>R$ {totalBalance}</span>
        <span className="font-regular text-start text-xs text-disabled-foreground dark:text-muted-foreground">
          {t("balance")}
        </span>
      </div>
    </span>
  );
}
