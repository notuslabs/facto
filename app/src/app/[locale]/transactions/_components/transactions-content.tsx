"use client";

import { useBalance } from "@/hooks/use-get-balance";
import { Link } from "@/navigation";
import { ArrowUpSquare, Loader2Icon, PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TransactionsContent() {
  const t = useTranslations("transactions-page");
  const { data, isPending } = useBalance();
  return (
    <div className="flex h-[582px] flex-col gap-8 rounded-t-3xl bg-primary-foreground px-4 pt-6">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-xs text-muted-foreground">{t("your-balance")}</span>
        {isPending ? (
          <Loader2Icon className="animate-spin text-facto-primary" size={24} />
        ) : (
          <span className="text-3xl font-extrabold">$ {data?.formattedBalance ?? "0.00"}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/transactions/deposit"
          className="flex flex-col items-center gap-2 rounded-2xl border border-border-hover p-8 dark:bg-[#252529]"
        >
          <PlusSquare size={24} className="text-facto-primary" />
          <span className="text-lg font-medium">{t("deposit")}</span>
        </Link>

        <Link
          href="/transactions/withdrawal"
          className="flex flex-col items-center gap-2 rounded-2xl border border-border-hover p-8 dark:bg-[#252529]"
        >
          <ArrowUpSquare size={24} className="text-facto-primary" />
          <span className="text-lg font-medium">{t("withdrawal")}</span>
        </Link>
      </div>
    </div>
  );
}
