"use client";

import { useTranslations } from "next-intl";
import { AboutCard } from "./about-card";
import { ReceptionCronogram } from "./cronogram-card";
import { ScoreCard } from "./score-card";
import { DetailsCard } from "./yield-card";
import { useState } from "react";
import { cn, getOfferInterestRate } from "@/lib/utils";
import { useOffer } from "@/hooks/use-offer";

type OfferContentProps = {
  offerId: string;
};

export function OfferContent({ offerId }: OfferContentProps) {
  const { data: offer } = useOffer(offerId);
  const [activeTab, setActiveTab] = useState("yield");
  const t = useTranslations("offer-page");

  if (!offer) return null;

  const tabs = [
    {
      name: "yield",
      display: t("tabs.yield.title"),
      content: (
        <DetailsCard
          installmentsCount={offer.installmentsCount}
          interestRate={getOfferInterestRate(offer.goalAmount, offer.installmentsTotalAmount)}
          description={offer.description}
        />
      ),
    },
    {
      name: "cronogram",
      display: t("tabs.income-schedule.title"),
      content: (
        <ReceptionCronogram
          totalInstallmentsPaid={offer.totalInstallmentsPaid}
          installmentsCount={offer.installmentsCount}
          installmentsStartDate={new Date(offer.installmentsStartDate)}
          installmentsTotalAmount={offer.installmentsTotalAmount}
        />
      ),
    },
    {
      name: "about-originator",
      display: t("tabs.about-originator.title"),
      content: (
        <AboutCard name={offer.originator.name} description={offer.originator.description} />
      ),
    },
    {
      name: "credit-score",
      display: t("tabs.credit-score.title"),
      content: <ScoreCard />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-8 pb-8">
      <div className="flex flex-col items-start gap-6">
        <div className="grid w-full grid-cols-1 items-center justify-center gap-2 border-border-hover p-1 text-primary sm:grid-cols-2 lg:flex lg:w-fit">
          {tabs.map((tab) => (
            <a
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full border p-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-3",
                activeTab === tab.name
                  ? "border-primary bg-primary text-on-color-foreground"
                  : "text-primary",
              )}
              href={`#${tab.name}`}
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.display}
            </a>
          ))}
        </div>
        {tabs.map((tab) => (
          <div className="w-full" id={tab.name} key={tab.name}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
