import { formatNumber } from "@/lib/format-number";
import { Button } from "./ui/button";
import { HelpingHand } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScoreBadge } from "./score-badge";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

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
  amountAcquired: number;
  amountToBeAcquired: number;
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
            <p className="text-sm ">{formatNumber(amountAcquired)}</p>
            <p className="text-sm">{formatNumber(amountToBeAcquired)}</p>
          </div>
        </div>

        <Progress
          indicatorColor="bg-success-strong"
          className="h-2.5 w-full rounded-full dark:bg-primary-foreground"
          value={(amountAcquired / amountToBeAcquired) * 100}
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
  offerNumber: number;
};

function OfferCardFooter({ installments, endDate, offerNumber }: OfferCardFooterProps) {
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

      <Button variant="default" size="sm">
        <a className="flex items-center gap-2" href={`${locale}/offers/${offerNumber}`}>
          {t("invest")}
          <HelpingHand size={16} />
        </a>
      </Button>
    </div>
  );
}

type OfferCardProps = {
  offerNumber: number;
};

export function OfferCard({ offerNumber }: OfferCardProps) {
  const t = useTranslations("home.offers.card.header");

  const nameExamples = [
    { name: "Growth Booster Bonds", originatorName: "Alpha Investments" },
    { name: "Fortune Builder Fund", originatorName: "Beta Capital" },
    { name: "Prosperity Portfolio", originatorName: "Gamma Finance" },
    { name: "Wealth Expansion Equity", originatorName: "Delta Ventures" },
    { name: "Opportunity Oasis", originatorName: "Omega Holdings" },
    { name: "Success Surge Securities", originatorName: "Sigma Securities" },
    { name: "Prosperity Pathway Plan", originatorName: "Zeta Funds" },
    { name: "Future Harvest Fund", originatorName: "Epsilon Investors" },
    { name: "WealthWise Opportunities", originatorName: "Theta Trust" },
    { name: "Capital Catalyst Collection", originatorName: "Nu Assets" },
  ];

  const randomData = {
    date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * Math.ceil(Math.random() * 300)),
    percent: Number((Math.random() * 15).toFixed(1)),
    creditScore: Math.floor(Math.random() * 1001),
    amountAcquired: Math.floor(Math.random() * 10000),
    amountToBeAcquired: Math.random() * 150000 + 10000,
    installments: Math.floor(Math.random() * 20) + 6,
  };

  return (
    <div className="rounded-lg border dark:border-border">
      <OfferCardHeader
        offerName={nameExamples[offerNumber - 1].name}
        originatorName={nameExamples[offerNumber - 1].originatorName}
        percent={randomData.percent}
        period={t("time-period")}
        secondaryText={t("awaited-return")}
      />
      <OfferCardBody
        creditScore={randomData.creditScore}
        amountAcquired={randomData.amountAcquired}
        amountToBeAcquired={randomData.amountToBeAcquired}
      />
      <OfferCardFooter
        installments={randomData.installments}
        endDate={randomData.date}
        offerNumber={offerNumber}
      />
    </div>
  );
}
