import { Button } from "./ui/button";
import { HelpingHand } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScoreBadge } from "./score-badge";
import { Badge, STATUSES_TO_VARIANTS } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Link } from "@/navigation";
import { Offer, OfferStatus, RangeOption } from "@/structs/Offer";
import { useFormatNumber } from "@/hooks/number-formatters";

type OfferCardHeaderProps = {
  offerName: string;
  borrowerName: string;
  period: string;
  interestRate: number;
  secondaryText: string;
};

function OfferCardHeader({
  offerName,
  borrowerName,
  interestRate,
  period,
  secondaryText,
}: OfferCardHeaderProps) {
  return (
    <div className="rounded-tl-lg rounded-tr-lg bg-subtle px-4 py-3">
      <div className="flex items-center justify-between gap-2 text-primary">
        <h3 className="text-lg font-semibold">{offerName}</h3>
        <span className="font-bold">
          {interestRate}% <span className="text-xs font-light">{period}</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <p className="text-xs">{borrowerName}</p>
        <p className="text-xs">{secondaryText}</p>
      </div>
    </div>
  );
}

type OfferCardBodyProps = {
  amountAcquired: number;
  amountToBeAcquired: number;
  scoreRange: RangeOption;
  status: OfferStatus;
};

function OfferCardBody({
  amountAcquired,
  amountToBeAcquired,
  scoreRange,
  status,
}: OfferCardBodyProps) {
  const formatNumber = useFormatNumber();
  const t = useTranslations("home.offers.card.body");
  const offerStatusT = useTranslations("offer-status");

  return (
    <div className="flex w-full flex-col text-muted-foreground">
      <div className="flex w-full flex-col gap-2 bg-secondary p-4">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">{t("raised-total")}</p>
            <p className="text-xs font-semibold">{t("total")}</p>
          </div>
          <div className="flex items-center justify-between gap-2 font-medium dark:text-primary">
            <p className="text-sm ">{formatNumber({ value: amountAcquired })}</p>
            <p className="text-sm">{formatNumber({ value: amountToBeAcquired })}</p>
          </div>
        </div>

        <Progress
          indicatorColor="bg-brand-500"
          className="h-2.5 w-full rounded-full dark:bg-primary-foreground"
          value={(amountAcquired / amountToBeAcquired) * 100}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border-hover bg-secondary px-4 py-[0.625rem]">
        <p className="text-xs">{t("project-status")}</p>
        <Badge variant={STATUSES_TO_VARIANTS[status]}>{offerStatusT(status)}</Badge>
      </div>
      <div className="flex items-center justify-between gap-2 bg-secondary px-4 py-[0.625rem]">
        <p className="text-xs">{t("credit-score")}</p>
        {scoreRange != null && <ScoreBadge scoreRange={scoreRange} />}
      </div>
      <div className="flex items-center justify-between gap-2 bg-secondary px-4 py-[0.625rem] text-xs">
        <p>{t("payment-frequency")}</p>
        <span className="font-semibold text-primary">{t("monthly")}</span>
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
  return (
    <div className="flex items-center justify-between gap-2 rounded-bl-lg rounded-br-lg bg-secondary px-4 pb-4 pt-3">
      <p className="flex flex-col gap-1 text-xs text-muted-foreground">
        {t("receive-in", { installments })}
        <span className="block text-sm font-semibold text-primary">{t("date", { endDate })}</span>
      </p>

      <Link
        className="flex items-center gap-2"
        href={{
          pathname: "/offers/[id]",
          params: { id: offerId },
        }}
      >
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
    <div className="rounded-lg border border-border">
      <OfferCardHeader
        offerName={offer.name}
        borrowerName={offer.borrower.name}
        interestRate={offer.interestRate}
        period={t("time-period")}
        secondaryText={t("awaited-return")}
      />

      <OfferCardBody
        scoreRange={offer.creditScore}
        amountAcquired={offer.acquiredAmount}
        amountToBeAcquired={offer.goalAmount}
        status={offer.status}
      />
      <OfferCardFooter
        installments={offer.installmentsCount}
        endDate={new Date(offer.installmentsEndDate)}
        offerId={offer.id}
      />
    </div>
  );
}
