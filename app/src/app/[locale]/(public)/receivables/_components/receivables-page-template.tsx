"use client";

import { Button } from "@/components/ui/button";
import { useInvestorInvestments } from "@/hooks/use-investor-investments";
import { PageProps } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import ReceivablesDesktopTable from "./receivables-desktop-table";
import ReceivablesMobileTable from "./receivables-mobile-table";

export function ReceivablesPageTemplate({ params }: PageProps<{ locale: string }>) {
  const t = useTranslations("receivables-page");
  const { data } = useInvestorInvestments();

  if (!data) return null;

  const offers = data.investorInvestments.length;

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 text-primary md:bg-primary-foreground md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-placeholder-foreground md:hidden">
            <span> {t("from-offers", { offers })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-placeholder-foreground">{t("exhibiting")}</span>
            <span className="text-sm font-medium">{t("installments-to-receive", { offers })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      {data.investorInvestments.length === 0 && (
        <div className="flex h-[300px] items-center justify-center gap-8 font-medium text-placeholder-foreground">
          No repayments found yet.
        </div>
      )}

      <ReceivablesDesktopTable investments={data.investorInvestments} />
      <ReceivablesMobileTable investments={data.investorInvestments} />
    </div>
  );
}
