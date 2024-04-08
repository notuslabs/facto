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
import { InstallmentStatus } from "@/structs/Offer";
import { useTranslations } from "next-intl";
import { ClaimReceivable } from "./claim-receivable-button";

interface ReceivableDesktopTableProps {
  investments: Investment[];
}

export default function ReceivablesDesktopTable({ investments }: ReceivableDesktopTableProps) {
  const t = useTranslations("receivables-page");
  const tb = useTranslations("badges");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {investments.map((investment, index) => {
        return investment.offer.installmentsList.map((installment) => {
          let installmentsReceived = investment.installmentsReceived
            ? investment.installmentsReceived + 1
            : 1;
          let isAbleToClaim =
            installment.status === InstallmentStatus.Paid &&
            installmentsReceived === installment.installmentNumber;

          return (
            <div
              className="flex items-center rounded-lg bg-secondary"
              key={`${installment.installmentNumber}-${index}-desktop`}
            >
              <Table>
                <>
                  <TableHeader className="text-xs text-placeholder-foreground">
                    <TableRow>
                      <TableHead className="h-4 w-[1/9] pt-3">{t("offer-name")}</TableHead>
                      <TableHead className="h-4 w-[1/9] pt-3">{t("date")}</TableHead>
                      <TableHead className="h-4 w-[1/9] pt-3">{t("installment")}</TableHead>
                      <TableHead className="h-4 w-[1/9] pt-3">{t("installment-value")}</TableHead>
                      <TableHead className="h-4 pt-3">{t("status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm font-medium">
                    <TableRow>
                      <TableCell className="pb-3 pt-2">{investment.offer.name}</TableCell>
                      <TableCell className="pb-3 pt-2">
                        {formatDate(installment.date, "P")}
                      </TableCell>
                      <TableCell className="pb-3 pt-2">{`${installment.installmentNumber}/${investment.offer.installmentsCount}`}</TableCell>
                      <TableCell className="pb-3 pt-2">
                        {formatCurrency({ value: installment.amount })}
                      </TableCell>
                      <TableCell className="pb-3 pt-2">
                        <div className="w-[100px]">
                          <Badge variant={installmentStatusToVariant[installment.status]}>
                            {tb(installment.status)}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </>
              </Table>
              <div className="px-4">
                <ClaimReceivable
                  offerId={investment.offer.id}
                  isAbleToClaim={isAbleToClaim}
                  investmentKey={`${investment.offer.id}-${index}`}
                />
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
