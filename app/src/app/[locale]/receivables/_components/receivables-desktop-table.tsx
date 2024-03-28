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

interface ReceivableDesktopTableProps {
  data: TableData[];
}

export default function ReceivablesDesktopTable({ data }: ReceivableDesktopTableProps) {
  const t = useTranslations("receivables-page");

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {data.map((tableData) => (
        <Table className="rounded-2xl bg-secondary p-4" key={tableData.offerName}>
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
  );
}
