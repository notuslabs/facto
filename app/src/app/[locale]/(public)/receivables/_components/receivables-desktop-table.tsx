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
import { useClaimInstallment } from "@/hooks/use-claim-installment";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useProgram } from "@/hooks/use-program";
import { Investment } from "@/structs/Investment";
import { InstallmentStatus } from "@/structs/Offer";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { data } = useProgram();

  const handleInstallmentClaim = async (
    event: React.MouseEvent<HTMLButtonElement>,
    offerId: string,
  ) => {
    event.currentTarget.disabled = true;

    const id = toast.loading(t("claiming-installment"));

    mutate(offerId, {
      async onSuccess(tx, variables, context) {
        await queryClient.invalidateQueries({
          queryKey: ["investor-investments", data?.keypair.publicKey.toString()],
        });
        queryClient.refetchQueries({
          queryKey: ["balance"],
        });
        toast.success(t("installment-claimed"), {
          action: (() => (
            <a
              href={`https://explorer.solana.com/tx/${tx}`}
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
      },
    });
  };

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {investments.map((investment) => {
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
              key={installment.installmentNumber}
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
                      <TableCell className=" pb-3 pt-2">
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
                <Button
                  disabled={!isAbleToClaim}
                  className="disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
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
