import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CircleDollarSign } from "lucide-react";

type TableData = {
  offerName: string;
  installmentDate: string;
  installmentsPaid: number;
  installmentTotal: number;
  installmentAmount: string;
  paymentStatus: JSX.Element;
};

interface DesktopTableProps {
  data: TableData[];
}

export default function InstallmentssDesktopTable({ data }: DesktopTableProps) {
  const t = useTranslations("installments-page");

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {data.map((tableData) => (
        <div
          className="flex content-center items-center rounded-2xl bg-secondary"
          key={tableData.offerName}
        >
          <Table className="mw-945 p-4">
            <>
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableRow>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("offer-name")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("installment-date")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("installments-count")}</TableHead>
                  <TableHead className="h-4 w-[1/9] pt-3">{t("installment-amount")}</TableHead>
                  <TableHead className="h-4 pt-3">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableRow>
                  <TableCell className="pb-3 pt-2">{tableData.offerName}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.installmentDate}</TableCell>
                  <TableCell className="pb-3 pt-2">{`${tableData.installmentsPaid + 1}/${tableData.installmentTotal}`}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.installmentAmount}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.paymentStatus}</TableCell>
                </TableRow>
              </TableBody>
            </>
          </Table>
          <Button
            size="sm"
            className="mr-4 disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
          >
            <CircleDollarSign size={16} /> Pagar
          </Button>
        </div>
      ))}
    </div>
  );
}
