"use client";

import { RocketTakingOff } from "@/components/illustrations/rocket-flying";
import { useSession } from "@/hooks/use-session";
import { useTranslations } from "next-intl";

export default function TransactionsHeader() {
  const { data } = useSession();
  const t = useTranslations("transactions-page");

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-xs text-muted-foreground">{t("welcome")}</span>
        <span className="text-lg font-bold">{data?.userInfo?.name}</span>
      </div>

      <div className="bg-brand-500 flex justify-between rounded-lg p-4">
        <div className="flex w-2/3 flex-col gap-1 text-sm font-medium text-on-color-foreground">
          <span>{t("description")}</span>
          <span className="text-base font-semibold">Facto</span>
        </div>
        <RocketTakingOff />
      </div>
    </div>
  );
}
