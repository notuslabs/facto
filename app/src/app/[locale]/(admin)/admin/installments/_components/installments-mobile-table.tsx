import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, installmentStatusToVariant } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { InstallmentStatus, Offer } from "@/structs/Offer";
import { PayButton } from "./pay-button";
import { useDateFormatter } from "@/hooks/use-date-formatter";

interface DesktopTableProps {
  data: Offer[];
}

export default function InstallmentsMobileTable({ data }: DesktopTableProps) {
  const format = useDateFormatter();
  const t = useTranslations("installments-page");
  const tr = useTranslations("badges");

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {data.map((tableData) => {
        return tableData.installmentsList.map((installment, index) => (
          <div
            className="flex flex-col content-center items-center rounded-2xl bg-secondary"
            key={`${tableData.name}-${installment.installmentNumber}`}
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
                    <Badge variant={installmentStatusToVariant[installment.status]}>
                      {tr(installment.status)}
                    </Badge>
                  </TableCell>
                </TableBody>
              </TableRow>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("installment-date")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{format(installment.date, "P")}</TableCell>
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
                  <TableCell>{`${installment.installmentNumber}/${tableData.installmentsCount}`}</TableCell>
                  <TableCell>{installment.amount.toFixed(2)}</TableCell>
                </TableBody>
              </TableRow>
            </Table>
            <div className="w-full content-center items-center px-4 py-3">
              <PayButton
                id={tableData.id}
                index={index}
                disable={
                  installment.status === InstallmentStatus.Paid ||
                  installment.installmentNumber !== (tableData.totalInstallmentsPaid ?? 0) + 1
                }
                className="w-full"
              />
            </div>
          </div>
        ));
      })}
    </div>
  );
}
