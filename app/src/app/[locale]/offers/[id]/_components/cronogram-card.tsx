import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { InstallmentsList } from "@/structs/Offer";
import { useTranslations } from "next-intl";

type ReceptionCronogramProps = {
  installmentsCount: number;
  installmentsList: InstallmentsList;
};

export function ReceptionCronogram({
  installmentsCount,
  installmentsList,
}: ReceptionCronogramProps) {
  const format = useDateFormatter();
  const t = useTranslations("offer-page.income-schedule");
  const tr = useTranslations("badges");
  const installments = installmentsList.map((installment) => ({
    ...installment,
    status: <Badge variant="secondary">{tr(installment.status)}</Badge>,
  }));

  return (
    <div className="rounded-2xl bg-primary-foreground text-sm text-primary">
      <h2 className="p-6 text-xl font-bold md:px-8 md:py-6">{t("title")}</h2>
      <Table>
        <TableHeader className="text-sm">
          <TableRow>
            <TableHead className="w-1/4 text-foreground">{t("date")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("installment-number")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("amount")}</TableHead>
            <TableHead className="w-1/4 text-right text-foreground">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((tableData) => (
            <TableRow
              className="border-b border-border"
              key={`${tableData.installmentNumber}/${installmentsCount}`}
            >
              <TableCell>{format(tableData.date, "P")}</TableCell>
              <TableCell>
                {tableData.installmentNumber}/{installmentsCount}
              </TableCell>
              <TableCell>{tableData.amount}</TableCell>
              <TableCell className="text-right">{tableData.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
