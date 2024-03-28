"use client";

import { useSession } from "@/components/auth-provider";
import { useTranslations } from "next-intl";

export default function TransactionsHeader() {
  const { userInfo } = useSession();
  const t = useTranslations("transactions-page");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-xs text-muted-foreground">{t("welcome")}</span>
        <span className="text-lg font-bold">{userInfo?.name}</span>
      </div>

      <div className="flex justify-between rounded-lg bg-facto-primary p-4">
        <div className="flex flex-col gap-1 text-sm font-medium text-on-color-foreground">
          <span>{t("description")}</span>
          <span className="text-base font-semibold">Facto</span>
        </div>
        <img src="@/components/illustrations/rocket-flying" alt="" />
      </div>
    </div>
  );
}
