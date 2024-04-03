"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useBalance } from "@/hooks/use-get-balance";
import { useInvestedAmount } from "@/hooks/use-invested-amount";
import { Offer } from "@/structs/Offer";
import { useTranslations } from "next-intl";
import { LateralCardForm } from "./lateral-card-form";

type LateralCardProps = {
  offer: Offer;
};

export function LateralCard({ offer }: LateralCardProps) {
  const { data: investedAmount } = useInvestedAmount(offer.id);
  const { data: balance, isPending: isLoadingBalance } = useBalance();
  const formatNumber = useFormatNumber();
  const format = useDateFormatter();
  const t = useTranslations("offer-page.lateral-card");

  return (
    <aside className="flex flex-col rounded-lg bg-secondary text-primary">
      <LateralCardForm
        offerId={offer.id}
        balance={balance?.formattedBalance}
        isLoadingBalance={isLoadingBalance}
        offerRemaining={offer.remainingAmount}
        minAmountInvest={offer.minAmountInvest}
      />

      <div className="rounded-bl-lg rounded-br-lg border bg-primary-foreground">
        <div className="flex justify-between px-4 py-[14px] text-sm font-medium text-muted-foreground md:px-6">
          <p>{t("you-invested")}</p>
          {investedAmount != null && (
            <span className="font-semibold">{formatNumber({ value: investedAmount })}</span>
          )}
        </div>
        <div className="flex justify-between px-4 pb-2 pt-4 md:px-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">{t("raised-value")}</span>
            <span className="font-semibold md:text-xl">
              {formatNumber({ value: offer.acquiredAmount })}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-right text-sm font-medium">Total</span>
            <span className="font-semibold md:text-xl">
              {formatNumber({ value: offer.goalAmount })}
            </span>
          </div>
        </div>

        <div className="p-4 md:px-6">
          <Progress
            indicatorColor="bg-success-strong"
            value={Math.round((offer.acquiredAmount / offer.goalAmount) * 100)}
          />
        </div>

        <div className="flex justify-between border-b border-t px-4 py-[14px] text-sm md:px-6">
          <p>{t("offer-status")}</p>
          <Badge variant="secondary" className="rounded-md">
            {/* TODO: use correct translation for status */}
            {offer.status}
            {/* {t("in-fundraising")} */}
          </Badge>
        </div>

        <div className="flex justify-between border-b px-4 py-[14px] text-sm md:px-6">
          <p>{t("payment-frequency")}</p>
          <span className="font-semibold">{t("monthly")}</span>
        </div>

        <div className="flex justify-between px-4 py-[14px] text-sm md:px-6">
          <p>{t("receive-in", { installments: offer.installmentsCount })}</p>
          <span className="font-semibold">{format(offer.installmentsEndDate, "P")}</span>
        </div>
      </div>
    </aside>
  );
}
