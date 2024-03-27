import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

type TableData = {
  offerName: string;
  date: string;
  installment: string;
  installmentValue: string;
  paymentStatus: JSX.Element;
};

interface MobileTableProps {
  data: TableData[];
}

export default function ReceivablesMobileTable({ data }: MobileTableProps) {
  const t = useTranslations("receivables-page");

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {data.map((tableData) => (
        <Table className="flex flex-col rounded-2xl bg-secondary" key={tableData.offerName}>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableHead>{t("offer-name")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.offerName}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableHead>{t("date")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.date}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableHead>{t("installment")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.installment}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("installment-value")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.installmentValue}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between">
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell className="text-right">{tableData.paymentStatus}</TableCell>
            </TableBody>
          </TableRow>
        </Table>
      ))}
    </div>
  );
}
