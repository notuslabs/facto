import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReceivablesPage() {
  const t = useTranslations("receivables-page");
  const tr = useTranslations("badges");
  const installments = 2;

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
    <div className="container flex flex-col gap-8 rounded-2xl p-10 dark:bg-primary-foreground dark:text-primary">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">{t("title")}</h2>
        <div className="flex gap-4">
          <div className="flex border-spacing-4 flex-col gap-1 border-r pr-4 text-right">
            <span className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              {t("exhibiting")}
            </span>
            <span className="text-sm font-medium">
              {t("installments-to-receive", { installments })}
            </span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tableData.map((tableData) => (
          <Table className="rounded-lg bg-secondary p-4" key={tableData.offerName}>
            <>
              <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
                <TableRow>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("offer-name")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("date")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("installment")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("installment-value")}</TableHead>
                  <TableHead className="h-4 w-[120px] pt-3 text-right">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableRow>
                  <TableCell className="pb-3 pt-2">{tableData.offerName}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.date}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.installment}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.installmentValue}</TableCell>
                  <TableCell className="w-[120px] pb-3 pt-2 text-right">
                    {tableData.paymentStatus}
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          </Table>
        ))}
      </div>
    </div>
  );
}
