import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageProps } from "@/lib/types";
import { DetailsCard } from "./_components/details-card";
import { ReceptionCronogram } from "./_components/reception-cronogram";
import { AboutCard } from "./_components/about-card";
import { LateralCard } from "./_components/lateral-card";
import { unstable_setRequestLocale } from "next-intl/server";

const tabs = [
  {
    name: "details",
    display: "Detalhes",
    content: <DetailsCard />,
  },
  {
    name: "cronogram",
    display: "Cronograma de recebimento",
    content: <ReceptionCronogram />,
  },
  {
    name: "about-originator",
    display: "Sobre o originador",
    content: <AboutCard />,
  },
  {
    name: "score",
    display: "Score de crédito",
    content: "abcdef",
  },
];

export default function OfferPage({ params }: PageProps<{ id: string } & { locale: string }>) {
  unstable_setRequestLocale(params.locale);
  return (
    <main className="container flex flex-col gap-[72px]">
      <Header title="Agiotagem" description="Nicholas Mariano Style" score={999} id={params.id} />

      <div className="flex gap-8">
        <div className="w-1/2">
          <Tabs defaultValue="details" className="flex flex-col items-start gap-4">
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
