import { Separator } from "@/components/ui/separator";
import { CalendarDays, HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";

type DetailsCardProps = {
  interestRate: number;
  installmentsCount: number;
  description: string;
};

export function DetailsCard({ interestRate, installmentsCount, description }: DetailsCardProps) {
  const t = useTranslations("offer-page.details-card");
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-primary-foreground p-6 text-sm text-primary md:p-8">
      <div className="flex flex-col justify-between gap-1 pb-2 md:flex-row">
        <div className="flex gap-2">
          <HandCoins className="text-brand-500 size-5 md:size-8" /> {t("title")}
        </div>
        <div>
          <span className="text-2xl font-bold">{interestRate}%</span> {t("per-year")}
        </div>
      </div>
      <Separator className="bg-secondary" />
      <div className="flex justify-between pb-4">
        <div className="flex gap-2">
          <CalendarDays className="text-brand-500 size-5 md:size-6" size={24} /> {t("loan-term")}
        </div>
        <div className="font-semibold">
          {installmentsCount} {t("months")}
        </div>
      </div>
      <p className="text-pretty">{description}</p>
    </div>
  );
}
