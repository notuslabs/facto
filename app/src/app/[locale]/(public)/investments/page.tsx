"use client";

import { Button } from "@/components/ui/button";
import { PageProps } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import InvestmentsMobileTable from "./_components/investments-mobile-table";
import InvestmentsDesktopTable from "./_components/investments-desktop-table";
import { useInvestorInvestments } from "@/hooks/use-investor-investments";

export default function InvestmentsPage({}: PageProps<{ locale: string }>) {
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
            <span>{t("offers", { totalInvestments })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-placeholder-foreground">{t("exhibiting")}</span>
            <span className="text-sm font-medium">{t("offers", { totalInvestments })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      <InvestmentsMobileTable investments={investorInvestments.investorInvestments} />
      <InvestmentsDesktopTable investments={investorInvestments.investorInvestments} />
    </div>
  );
}
