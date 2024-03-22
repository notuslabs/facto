import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutCard } from "./_components/about-card";
import { LateralCard } from "./_components/lateral-card";
import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ReceptionCronogram } from "./_components/cronogram-card";
import { ScoreCard } from "./_components/score-card";
import { DetailsCard } from "./_components/yield-card";

type OfferPageProps = {
  params: {
    id: string;
    locale: string;
  };
};

export default function OfferPage({ params }: OfferPageProps) {
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

  unstable_setRequestLocale(params.locale);
  return (
    <main className="container flex flex-col gap-[72px]">
      <Header title="Agiotagem" description="Nicholas Mariano Style" score={999} id={params.id} />

      <div className="flex gap-8">
        <div className="w-1/2">
          <Tabs defaultValue="yield" className="flex flex-col items-start gap-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger value={tab.name} key={tab.name}>
                  {tab.display}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent className="w-full" key={tab.name} value={tab.name}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="-mt-40 w-1/2">
          <LateralCard />
        </div>
      </div>
    </main>
  );
}
