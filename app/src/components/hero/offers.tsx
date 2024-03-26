import { ChevronDown, Search } from "lucide-react";
import { Card } from "../card";
import { Input } from "../ui/input";
import { OfferCard } from "../offer-card";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import type { Offer } from "@/lib/idl/offer";

export type OfferCardProps = {
  offers: Offer[];
};

export function Offers({ offers }: OfferCardProps) {
  const t = useTranslations("home.offers");
  return (
    <>
      <div className="h-[168px] w-full dark:bg-background" />
      <div className="container -mt-[168px] flex flex-col gap-9">
        <div className="flex items-center justify-between gap-4">
          <div className="w-80">
            <Input
              leftIcon={Search}
              placeholder={t("search-input-placeholder")}
              className="pl-10"
            />
          </div>
          <Button variant="secondary" className="flex items-center">
            {t("offer-stage")} <ChevronDown size={20} />
          </Button>
        </div>
        <Card className="flex flex-col gap-6">
          <h2 className="bg-back text-2xl font-bold dark:text-primary">{t("title")}</h2>

          <div className="grid grid-cols-3 gap-10">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
