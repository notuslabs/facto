import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageProps } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import InvestmentsMobileTable from "./_components/investments-mobile-table";
import InvestmentsDesktopTable from "./_components/investments-desktop-table";

export default function InvestmentsPage({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);

  const t = useTranslations("investments-page");
  const tr = useTranslations("badges");

  const tableData = [
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
  ];

  const offerNumber = 6;

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 dark:text-primary md:p-10 md:dark:bg-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-muted-foreground dark:text-placeholder-foreground md:hidden">
            <span>{t("exhibiting")}</span>
            <span>{t("offers", { offerNumber })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              {t("exhibiting")}
            </span>
            <span className="text-sm font-medium">{t("offers", { offerNumber })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      <InvestmentsMobileTable data={tableData} />
      <InvestmentsDesktopTable data={tableData} />
    </div>
  );
}
