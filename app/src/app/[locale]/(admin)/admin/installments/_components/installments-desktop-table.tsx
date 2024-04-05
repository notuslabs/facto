import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, installmentStatusToVariant } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { InstallmentStatus, Offer } from "@/structs/Offer";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { PayButton } from "./pay-button";
import { useFormatNumber } from "@/hooks/number-formatters";

interface DesktopTableProps {
  data: Offer[];
}

export default function InstallmentssDesktopTable({ data }: DesktopTableProps) {
  const format = useDateFormatter();
  const formatCurrency = useFormatNumber();
  const t = useTranslations("installments-page");
  const tr = useTranslations("badges");

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {data.map((tableData) => {
        return tableData.installmentsList.map((installment, index) => (
          <div
            className="flex content-center items-center rounded-2xl bg-secondary"
            key={`${tableData.name}-${installment.installmentNumber}`}
          >
            <Table className="p-4">
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
                    <TableCell className="pb-3 pt-2">{tableData.name}</TableCell>
                    <TableCell className="pb-3 pt-2">{format(installment.date, "P")}</TableCell>
                    <TableCell className="pb-3 pt-2">{`${installment.installmentNumber}/${tableData.installmentsCount}`}</TableCell>
                    <TableCell className="pb-3 pt-2">
                      {formatCurrency({ value: installment.amount })}
                    </TableCell>
                    <TableCell className="pb-3 pt-2">
                      <div className="w-[100px]">
                        <Badge variant={installmentStatusToVariant[installment.status]}>
                          {tr(installment.status)}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </>
            </Table>
            <PayButton
              id={tableData.id}
              index={index}
              disable={
                installment.status === InstallmentStatus.Paid ||
                installment.installmentNumber !== tableData.totalInstallmentsPaid + 1
              }
              amount={installment.amount}
            />
          </div>
        ));
      })}
    </div>
  );
}
