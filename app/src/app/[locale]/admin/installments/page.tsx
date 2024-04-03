import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, CircleDollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import InstallmentsMobileTable from "./_components/installments-mobile-table";
import InstallmentssDesktopTable from "./_components/installments-desktop-table";

export default function InstallmentsPage() {
  const t = useTranslations("installments-page");
  const tr = useTranslations("badges");

  const tableData = [
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "ali",
    },
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "alo",
    },
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "alo",
    },
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "alo",
    },
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "alo",
    },
    {
      offerName: "Agiotagem #1",
      installmentDate: "16/04/2024",
      installmentsPaid: 1,
      installmentTotal: 12,
      installmentAmount: "R$ 420",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
      link: "alo",
    },
  ];

  const offerNumber = tableData.length;

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 text-primary md:bg-primary-foreground md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-placeholder-foreground md:hidden">
            <span>{t("exhibiting")}</span>
            <span>{t("offers", { offerNumber })}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-placeholder-foreground">{t("exhibiting")}</span>
            <span className="text-sm font-medium">{t("offers", { offerNumber })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>
      <InstallmentsMobileTable data={tableData} />
      <InstallmentssDesktopTable data={tableData} />
    </div>
  );
}
