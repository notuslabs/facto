"use client";

import { Header } from "@/components/header";
import { AboutCard } from "./_components/about-card";
import { LateralCard } from "./_components/lateral-card";
import { useTranslations } from "next-intl";
import { ReceptionCronogram } from "./_components/cronogram-card";
import { ScoreCard } from "./_components/score-card";
import { DetailsCard } from "./_components/yield-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

type OfferPageProps = {
  params: {
    id: string;
    locale: string;
  };
};

export default function OfferPage({ params }: OfferPageProps) {
  const [activeTab, setActiveTab] = useState("yield");
  const t = useTranslations("offer-page");

  const tabs = [
    {
      name: "yield",
      display: t("tabs.yield.title"),
      content: <DetailsCard />,
    },
    {
      name: "cronogram",
      display: t("tabs.income-schedule.title"),
      content: <ReceptionCronogram />,
    },
    {
      name: "about-originator",
      display: t("tabs.about-originator.title"),
      content: <AboutCard />,
    },
    {
      name: "credit-score",
      display: t("tabs.credit-score.title"),
      content: <ScoreCard />,
    },
  ];

  return (
    <main className="flex flex-col gap-8 p-4 md:container lg:gap-[4.5rem]">
      <div className="md:hidden">
        <LateralCard />
      </div>

      <Header title="Agiotagem" description="Nicholas Mariano Style" score={999} id={params.id} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="flex w-full flex-col gap-8 pb-8">
          <div className="flex flex-col items-start gap-6">
            <div className="z-50 grid w-full grid-cols-1 items-center justify-center gap-2 border-border-hover p-1 text-primary sm:grid-cols-2 lg:flex lg:w-fit">
              {tabs.map((tab) => (
                <a
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full border p-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-3",
                    activeTab === tab.name ? "bg-primary text-on-color-foreground" : "text-primary",
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

        <div className="hidden w-full md:mt-[4.5rem] md:block lg:-mt-40">
          <LateralCard />
        </div>
      </div>
    </main>
  );
}
