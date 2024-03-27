import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PageProps } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import ReceivablesDesktopTable from "./_components/receivables-desktop-table";
import ReceivablesMobileTable from "./_components/receivables-mobile-table";

export default function ReceivablesPage({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations("receivables-page");
  const tr = useTranslations("badges");
  const offers = 2;

  const tableData = [
    {
      offerName: "Agiotagem #1",
      date: "16/04/2024",
      installment: "1/4",
      installmentValue: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      date: "16/05/2024",
      installment: "2/4",
      installmentValue: "R$ 420",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      date: "16/06/2024",
      installment: "3/4",
      installmentValue: "R$ 420",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      date: "16/07/2024",
      installment: "4/4",
      installmentValue: "R$ 420",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #2",
      date: "24/05/2024",
      installment: "1/2",
      installmentValue: "R$ 666",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #2",
      date: "24/06/2024",
      installment: "2/2",
      installmentValue: "R$ 666",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
  ];

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 dark:text-primary md:p-10 md:dark:bg-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-muted-foreground dark:text-placeholder-foreground md:hidden">
            <span> {t("from-offers", { offers })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              {t("exhibiting")}
            </span>
            <span className="text-sm font-medium">{t("installments-to-receive", { offers })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      <ReceivablesDesktopTable data={tableData} />
      <ReceivablesMobileTable data={tableData} />
    </div>
  );
}
