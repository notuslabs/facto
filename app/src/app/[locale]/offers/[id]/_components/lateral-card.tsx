"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useBalance } from "@/hooks/use-get-balance";
import { useInvestedAmount } from "@/hooks/use-invested-amount";
import { Offer } from "@/structs/Offer";
import { ChevronDown, HelpingHand, Loader2, Smile } from "lucide-react";
import { useTranslations } from "next-intl";

type LateralCardProps = {
  offer: Offer;
};

export function LateralCard({ offer }: LateralCardProps) {
  const { data: investedAmount } = useInvestedAmount(offer.id);
  const { data: balance, isPending: isLoadingBalance, isError } = useBalance();
  const formatNumber = useFormatNumber();
  const format = useDateFormatter();
  const t = useTranslations("offer-page.lateral-card");

  return (
    <aside className="flex flex-col rounded-lg bg-secondary text-primary">
      <div className="p-4">
        <Button className="flex gap-2 bg-subtle text-placeholder-foreground md:hidden">
          <div className="flex size-5 items-center justify-center rounded-full bg-black"></div>
          Fake Token
          <ChevronDown size={20} />
        </Button>
      </div>

      <div className="flex justify-between px-4 md:p-6">
        <div>
          <p className="text-placeholder text-2xl font-semibold text-placeholder-foreground">$0</p>
          {(isLoadingBalance || balance) && (
            <p className="flex items-center gap-1 whitespace-nowrap text-xs text-primary">
              {t("your-balance")}
              {isLoadingBalance ? (
                <span>
                  <Loader2 strokeWidth={2} size={12} className="animate-spin" />
                </span>
              ) : (
                balance && (
                  <span className="font-bold underline underline-offset-2">
                    {formatNumber({ value: balance?.formattedBalance ?? 0 })}
                  </span>
                )
              )}
            </p>
          )}
        </div>
        <Button className="hidden gap-2 bg-subtle text-placeholder-foreground md:flex">
          <div className="flex size-5 items-center justify-center rounded-full bg-black"></div>
          Fake Token
          <ChevronDown size={20} />
        </Button>
      </div>

      <div className="p-4 md:p-6">
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2 bg-subtle text-placeholder-foreground"
        >
          {t("invest-now")}
          <HelpingHand size={16} />
        </Button>
      </div>

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
