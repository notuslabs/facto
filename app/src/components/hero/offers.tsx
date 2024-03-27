import { ChevronDown, ListFilter, Search } from "lucide-react";
import { Card } from "../card";
import { Input } from "../ui/input";
import { OfferCard } from "../offer-card";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export function Offers() {
  const t = useTranslations("home.offers");
  return (
    <>
      <div className="h-[168px] w-full bg-background" />
      <div className="-mt-[168px] flex flex-col gap-9 p-4 md:container">
        <div className="flex items-center justify-between gap-4">
          <div className="w-80">
            <Input
              leftIcon={Search}
              placeholder={t("search-input-placeholder")}
              className="pl-10"
            />
          </div>
          <Button variant="secondary" className="hidden items-center md:flex">
            {t("offer-stage")} <ChevronDown size={20} />
          </Button>
          <Button variant="secondary" className="flex items-center md:hidden">
            <ListFilter size={20} /> {t("filter")}
          </Button>
        </div>
        <Card className="flex flex-col gap-6">
          <h2 className="bg-back text-medium text-primary md:text-2xl md:font-bold">
            {t("title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:gap-10 xl:grid-cols-3">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <OfferCard key={index} offerNumber={index + 1} />
              ))}
          </div>
        </Card>
      </div>
    </>
  );
}
