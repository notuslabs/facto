import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Offer } from "@/structs/Offer";

interface DesktopTableProps {
  data: Offer[];
}

export default function InstallmentsMobileTable({ data }: DesktopTableProps) {
  const t = useTranslations("installments-page");
  const tr = useTranslations("badges");

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {data.map((tableData) => {
        console.log(tableData.installmentsList);
        const isOnTrack = tableData.status === "OnTrack";
        const paymentStatus = isOnTrack ? "upcoming" : "overdue";
        const paymentColor: "red" | "yellow" = isOnTrack ? "red" : "yellow";
        return (
          <div
            className="flex flex-col content-center items-center rounded-2xl bg-secondary"
            key={tableData.name}
          >
            <Table>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("offer-name")}</TableHead>
                  <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{tableData.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{tr(paymentStatus)}</Badge>
                  </TableCell>
                </TableBody>
              </TableRow>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("installment-date")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{tableData.installmentsNextPaymentDate}</TableCell>
                  <TableCell className="pb-3 pt-2">
                    <a className="flex items-center gap-2" href={"tableData.link"}>
                      <ExternalLink size={20} />
                      <span className="underline underline-offset-2">{t("see-offer")}</span>
                    </a>
                  </TableCell>
                </TableBody>
              </TableRow>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("installments-count")}</TableHead>
                  <TableHead className="h-4 pt-3">{t("installment-amount")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{`${tableData.totalInstallmentsPaid + 1}/${tableData.installmentsCount}`}</TableCell>
                  <TableCell>{tableData.installmentsTotalAmount}</TableCell>
                </TableBody>
              </TableRow>
            </Table>
            <div className="w-full content-center items-center px-4 py-3">
              <Button
                size="sm"
                className="w-full disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
              >
                <CircleDollarSign size={16} /> Pagar
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
