import { Badge, installmentStatusToVariant } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Investment } from "@/structs/Investment";
import { useTranslations } from "next-intl";

interface MobileTableProps {
  investments: Investment[];
}

export default function ReceivablesMobileTable({ investments }: MobileTableProps) {
  const t = useTranslations("receivables-page");
  const tb = useTranslations("badges");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {investments.map((investment) => {
        return investment.offer.installmentsList.map((installment) => (
          <Table className="flex flex-col rounded-2xl bg-secondary" key={investment.offer.name}>
            <TableRow className="flex items-center justify-between border-b border-border-hover">
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableHead>{t("offer-name")}</TableHead>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableCell>{investment.offer.name}</TableCell>
              </TableBody>
            </TableRow>
            <TableRow className="flex items-center justify-between border-b border-border-hover">
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableHead>{t("date")}</TableHead>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableCell>{formatDate(installment.date, "P")}</TableCell>
              </TableBody>
            </TableRow>
            <TableRow className="flex items-center justify-between border-b border-border-hover">
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableHead>{t("installment")}</TableHead>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableCell>{`${installment.installmentNumber}/${investment.offer.installmentsCount}`}</TableCell>
              </TableBody>
            </TableRow>
            <TableRow className="flex items-center justify-between border-b border-border-hover">
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableHead className="h-4 pt-3">{t("installment-value")}</TableHead>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableCell>{formatCurrency({ value: installment.amount })}</TableCell>
              </TableBody>
            </TableRow>
            <TableRow className="flex items-center justify-between">
              <TableHeader className="text-xs text-placeholder-foreground">
                <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
              </TableHeader>
              <TableBody className="text-sm font-medium">
                <TableCell className="text-right">
                  <Badge variant={installmentStatusToVariant[installment.status]}>
                    {tb(installment.status)}
                  </Badge>
                </TableCell>
              </TableBody>
            </TableRow>
          </Table>
        ));
      })}
    </div>
  );
}
