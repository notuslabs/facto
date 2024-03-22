import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

export function ReceptionCronogram() {
  const t = useTranslations("offer-page.income-schedule");
  const tr = useTranslations("badges");

  const tableData = [
    {
      data: "16/04/2024",
      paymentNumber: "1/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
    },
    {
      data: "16/04/2024",
      paymentNumber: "2/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      paymentNumber: "3/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      paymentNumber: "4/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      paymentNumber: "5/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      paymentNumber: "6/6",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
  ];
  return (
    <div className="rounded-2xl dark:bg-primary-foreground dark:text-primary">
      <h2 className="px-8 py-6 text-xl font-bold">{t("title")}</h2>
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
          {tableData.map((tableData) => (
            <TableRow className="border-b text-sm dark:border-border" key={tableData.data}>
              <TableCell>{tableData.data}</TableCell>
              <TableCell>{tableData.paymentNumber}</TableCell>
              <TableCell>{tableData.totalAmount}</TableCell>
              <TableCell className="text-right">{tableData.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
