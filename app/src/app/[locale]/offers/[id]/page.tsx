"use client";

import { Header } from "@/components/header";
import { AboutCard } from "./_components/about-card";
import { LateralCard } from "./_components/lateral-card";
import { useTranslations } from "next-intl";
import { ReceptionCronogram } from "./_components/cronogram-card";
import { ScoreCard } from "./_components/score-card";
import { DetailsCard } from "./_components/yield-card";
import { useState } from "react";

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
    <main className="container flex flex-col gap-[72px]">
      <Header title="Agiotagem" description="Nicholas Mariano Style" score={999} id={params.id} />

      <div className="flex gap-8">
        <div className="flex w-1/2 flex-col gap-8 pb-8">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex h-11 items-center justify-center gap-2 p-1 dark:border-border-hover dark:text-primary">
              {tabs.map((tab) => (
                <a
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border p-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab === tab.name ? "bg-primary text-on-color-foreground" : "dark:text-primary"}`}
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

        <div className="-mt-40 w-1/2">
          <LateralCard />
        </div>
      </div>
    </main>
  );
}
