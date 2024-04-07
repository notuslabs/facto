import { Badge, installmentStatusToVariant } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useClaimInstallment } from "@/hooks/use-claim-installment";
import { useQueryClient } from "@tanstack/react-query";
import { useProgram } from "@/hooks/use-program";
import { CircleDollarSign } from "lucide-react";

interface MobileTableProps {
  investments: Investment[];
}

export default function ReceivablesMobileTable({ investments }: MobileTableProps) {
  const t = useTranslations("receivables-page");
  const { mutate: invest } = useClaimInstallment();
  const tb = useTranslations("badges");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();
  const queryClient = useQueryClient();
  const { data } = useProgram();

  const handleInstallmentClaim = async (
    event: React.MouseEvent<HTMLButtonElement>,
    offerId: string,
  ) => {
    event.currentTarget.disabled = true;

    const id = toast.loading(t("claiming-installment"));

    invest(offerId, {
      async onSuccess(tx, variables, context) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["investor-investments", data?.keypair.publicKey.toString()],
          }),
          queryClient.invalidateQueries({
            queryKey: ["token-accounts"],
          }),
        ]);

        toast.success(t("installment-claimed"), {
          action: (() => (
            <a
              href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("view-transaction")}
            </a>
          ))(),
          id,
        });
      },
      onError(error, variables, context) {
        toast.error(error.message, {
          id,
        });
        event.currentTarget.disabled = true;
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {investments.map((investment) => {
        return investment.offer.installmentsList.map((installment) => {
          let installmentsReceived = investment.installmentsReceived
            ? investment.installmentsReceived + 1
            : 1;
          let isAbleToClaim =
            installment.status === InstallmentStatus.Paid &&
            installmentsReceived === installment.installmentNumber;

          return (
            <div key={installment.installmentNumber} className="bg-secondary">
              <Table className="flex flex-col rounded-2xl bg-secondary">
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
              <div className="px-4 py-3">
                <Button
                  disabled={!isAbleToClaim}
                  className="w-full disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
                  onClick={(event) => handleInstallmentClaim(event, investment.offer.id)}
                >
                  <CircleDollarSign size={16} />
                  {t("claim")}
                </Button>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
