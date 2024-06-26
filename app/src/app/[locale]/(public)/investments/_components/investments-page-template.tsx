"use client";

import { ChevronDown } from "lucide-react";
import InvestmentsMobileTable from "./investments-mobile-table";
import InvestmentsDesktopTable from "./investments-desktop-table";
import { useTranslations } from "next-intl";
import { useInvestorInvestments } from "@/hooks/use-investor-investments";
import { PageProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { HandCardMoney } from "@/components/illustrations/hand-card-money";
import HandMoney from "@/components/illustrations/hand-money";

export function InvestmentsPageTemplate({ params }: PageProps<{ locale: string }>) {
  const { data: investorInvestments } = useInvestorInvestments();

  const t = useTranslations("investments-page");

  if (!investorInvestments) return null;

  const totalInvestments = investorInvestments.investorInvestments.length;

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 text-primary md:bg-primary-foreground md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-placeholder-foreground md:hidden">
            <span>{t("exhibiting")}</span>
            <span>{t("offers", { offerNumber: totalInvestments })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-placeholder-foreground">{t("exhibiting")}</span>
            <span className="text-sm font-medium">
              {t("offers", { offerNumber: totalInvestments })}
            </span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      {investorInvestments.investorInvestments.length === 0 && (
        <div className="flex h-[403px] flex-col items-center justify-center gap-4">
          <HandMoney />
          <div className="flex flex-col items-center justify-center gap-1 text-placeholder-foreground">
            <span className="text-base text-primary">{t("no-investments")}</span>
            <span className="text-sm">{t("no-investments-description")}</span>
          </div>
        </div>
      )}

      <InvestmentsMobileTable investments={investorInvestments.investorInvestments} />
      <InvestmentsDesktopTable investments={investorInvestments.investorInvestments} />
    </div>
  );
}
