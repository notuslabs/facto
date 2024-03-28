import { formatBigNumber } from "@/lib/format-number";
import { Button } from "./ui/button";
import { HelpingHand } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScoreBadge } from "./score-badge";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { Offer } from "@/structs/Offer";
import BN from "bn.js";

type OfferCardHeaderProps = {
  offerName: string;
  originatorName: string;
  period: string;
  percent: number;
  secondaryText: string;
};

function OfferCardHeader({
  offerName,
  originatorName,
  percent,
  period,
  secondaryText,
}: OfferCardHeaderProps) {
  return (
    <div className="rounded-tl-lg rounded-tr-lg bg-subtle px-4 py-3">
      <div className="flex items-center justify-between gap-2 dark:text-primary">
        <h3 className="text-lg font-semibold">{offerName}</h3>
        <span className="font-bold">
          {percent}% <span className="text-xs font-light">{period}</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <p className="text-xs">{originatorName}</p>
        <p className="text-xs">{secondaryText}</p>
      </div>
    </div>
  );
}

type OfferCardBodyProps = {
  amountAcquired: BN;
  amountToBeAcquired: BN;
  creditScore: number;
};

function OfferCardBody({ amountAcquired, amountToBeAcquired, creditScore }: OfferCardBodyProps) {
  const t = useTranslations("home.offers.card.body");

  return (
    <div className="flex w-full flex-col dark:text-muted-foreground">
      <div className="flex w-full flex-col gap-2 p-4 dark:bg-secondary">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">{t("raised-total")}</p>
            <p className="text-xs font-semibold">{t("total")}</p>
          </div>
          <div className="flex items-center justify-between gap-2 font-medium dark:text-primary">
            <p className="text-sm ">{formatBigNumber(amountAcquired)}</p>
            <p className="text-sm">{formatBigNumber(amountToBeAcquired)}</p>
          </div>
        </div>

        <Progress
          indicatorColor="bg-facto-primary"
          className="h-2.5 w-full rounded-full dark:bg-primary-foreground"
          value={(amountAcquired.toNumber() / amountToBeAcquired.toNumber()) * 100}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t px-4 py-[0.625rem] dark:border-border-hover dark:bg-secondary">
        <p className="text-sm">{t("project-status")}</p>
        <Badge variant="secondary" className="rounded-md text-muted-foreground dark:bg-background">
          {t("in-fundraising")}
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-2 border-b border-t px-4 py-[0.625rem] dark:border-border-hover dark:bg-secondary">
        <p className="text-sm">{t("credit-score")}</p>
        <ScoreBadge score={creditScore} />
      </div>
      <div className="flex items-center justify-between gap-2 border-b px-4 py-[0.625rem] dark:border-border-hover dark:bg-secondary">
        <p className="text-sm">{t("payment-frequency")}</p>
        <span className="text-xs font-semibold dark:text-primary">{t("monthly")}</span>
      </div>
    </div>
  );
}

type OfferCardFooterProps = {
  installments: number;
  endDate: Date;
  offerId: string;
};

function OfferCardFooter({ installments, endDate, offerId }: OfferCardFooterProps) {
  const t = useTranslations("home.offers.card.footer");
  const locale = useLocale();
  return (
    <div className="flex items-center justify-between gap-2 rounded-bl-lg rounded-br-lg px-4 pb-4 pt-3 dark:bg-secondary">
      <p className="flex flex-col gap-1 text-xs text-muted-foreground">
        {t("receive-in", { installments })}
        <span className="block text-sm font-semibold dark:text-primary">
          {t("date", { endDate })}
        </span>
      </p>

      <Link className="flex items-center gap-2" href={`${locale}/offers/${offerId}`}>
        <Button variant="default" size="sm">
          {t("invest")}
          <HelpingHand size={16} />
        </Button>
      </Link>
    </div>
  );
}

type OfferCardProps = {
  offer: Offer;
};

export function OfferCard({ offer }: OfferCardProps) {
  const t = useTranslations("home.offers.card.header");

  return (
    <div className="rounded-lg border dark:border-border">
      <OfferCardHeader
        offerName={offer.name}
        originatorName={offer.originator.name}
        percent={offer.interestRatePercent}
        period={t("time-period")}
        secondaryText={t("awaited-return")}
      />
      <OfferCardBody
        creditScore={offer.creditScore}
        amountAcquired={offer.acquiredAmount}
        amountToBeAcquired={offer.goalAmount}
      />
      <OfferCardFooter
        installments={offer.installmentsTotal}
        endDate={offer.deadlineDate}
        offerId={offer.id}
      />
    </div>
  );
}
