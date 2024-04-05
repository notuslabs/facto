import { Badge, installmentStatusToVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useClaimInstallment } from "@/hooks/use-claim-installment";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Investment } from "@/structs/Investment";
import { CircleDollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ReceivableDesktopTableProps {
  investments: Investment[];
}

export default function ReceivablesDesktopTable({ investments }: ReceivableDesktopTableProps) {
  const { mutate, isPending } = useClaimInstallment();
  const t = useTranslations("receivables-page");
  const tb = useTranslations("badges");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();

  const handleInstallmentClaim = async (offerId: string) => {
    mutate(offerId, {
      onSuccess(data, variables, context) {
        toast.success("success");
      },
    });
  };

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {investments.map((investment) => {
        return investment.offer.installmentsList.map((installment) => (
          <div className="flex items-center rounded-lg bg-secondary" key={investment.offer.name}>
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
                    <TableCell className="pb-3 pt-2">{formatDate(installment.date, "P")}</TableCell>
                    <TableCell className="pb-3 pt-2">{`${installment.installmentNumber}/${investment.offer.installmentsCount}`}</TableCell>
                    <TableCell className="pb-3 pt-2">
                      {formatCurrency({ value: installment.amount })}
                    </TableCell>
                    <TableCell className="pb-3 pt-2">
                      <Badge variant={installmentStatusToVariant[installment.status]}>
                        {tb(installment.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </>
            </Table>
            <div className="px-4">
              <Button onClick={() => handleInstallmentClaim(investment.offer.id)}>
                <CircleDollarSign size={16} />
                {t("claim")}
              </Button>
            </div>
          </div>
        ));
      })}
    </div>
  );
}
