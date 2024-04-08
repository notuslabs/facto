import { Button, buttonVariants } from "@/components/ui/button";
import { useOfferInvestmentsClaim } from "@/hooks/use-offer-investments-claim";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function ClaimInvestments({
  investmentKey,
  isClaimable,
  offerId,
}: {
  investmentKey: string;
  offerId: string;
  isClaimable: boolean;
}) {
  const queryClient = useQueryClient();
  const { mutate: offerInvestmentsClaim, isPending: isClaiming } = useOfferInvestmentsClaim({
    key: investmentKey,
  });
  const t = useTranslations("admin-offers");

  function handleOfferInvestmentsClaim() {
    const id = toast.loading(t("claiming-investments"));

    offerInvestmentsClaim(offerId, {
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["offers-by-borrower"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["token-accounts"],
          }),
        ]);
        toast.success(t("investments-claimed"), {
          id,
          action: (() => (
            <a
              href={`https://explorer.solana.com/tx/${data?.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("view-transaction")}
            </a>
          ))(),
        });
      },
      onError(error) {
        console.error(error);
        toast.error(error.message, { id });
      },
    });
  }

  return (
    <Button
      disabled={!isClaimable || isClaiming}
      className="disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
      onClick={handleOfferInvestmentsClaim}
    >
      {isClaiming ? <Loader2 size={16} className="animate-spin" /> : <CircleDollarSign size={16} />}
      {t("claim-investments")}
    </Button>
  );
}
