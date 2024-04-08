import { Button, buttonVariants } from "@/components/ui/button";
import { useClaimInstallment } from "@/hooks/use-claim-installment";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type ClaimReceivableProps = {
  isAbleToClaim: boolean;
  offerId: string;
  investmentKey: string;
};

export function ClaimReceivable({ isAbleToClaim, offerId, investmentKey }: ClaimReceivableProps) {
  const queryClient = useQueryClient();
  const { mutate: claimInstallment, isPending: isClaiming } = useClaimInstallment({
    key: investmentKey,
  });
  const t = useTranslations("receivables-page");

  async function handleInstallmentClaim(
    event: React.MouseEvent<HTMLButtonElement>,
    offerId: string,
  ) {
    event.currentTarget.disabled = true;

    const id = toast.loading(t("claiming-installment"));

    claimInstallment(offerId, {
      async onSuccess(tx) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["investor-investments"],
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
      onError(error) {
        console.error(error);
        toast.error(error.message, {
          id,
        });
        event.currentTarget.disabled = true;
      },
    });
  }

  return (
    <Button
      disabled={!isAbleToClaim}
      className="disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
      onClick={(event) => handleInstallmentClaim(event, offerId)}
    >
      {isClaiming ? <Loader2 size={16} className="animate-spin" /> : <CircleDollarSign size={16} />}
      {t("claim")}
    </Button>
  );
}
