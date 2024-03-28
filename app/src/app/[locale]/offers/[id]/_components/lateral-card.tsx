import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, HelpingHand, Smile } from "lucide-react";
import { useTranslations } from "next-intl";

export function LateralCard() {
  const t = useTranslations("offer-page.lateral-card");
  const installments = 6;
  const date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);

  return (
    <aside className="flex flex-col rounded-lg dark:bg-secondary dark:text-primary">
      <div className="p-4">
        <Button className="flex gap-2 bg-primary text-muted-foreground dark:bg-subtle dark:text-placeholder-foreground md:hidden">
          <div className="flex size-5 items-center justify-center rounded-full bg-black">
            <Smile className="text-purple-500" size={14} />
          </div>
          Solana
          <ChevronDown size={20} />
        </Button>
      </div>
      <div className="flex justify-between px-4 md:p-6">
        <div>
          <p className="text-placeholder text-2xl font-semibold text-muted-foreground dark:text-placeholder-foreground">
            $0
          </p>
          <p className="text-xs text-primary dark:text-primary">
            {t("your-balance")}
            <span className="font-bold underline underline-offset-2">R$ 69.420,24</span>
          </p>
        </div>
        <Button className="hidden gap-2 bg-primary text-muted-foreground dark:bg-subtle dark:text-placeholder-foreground md:flex">
          <div className="flex size-5 items-center justify-center rounded-full bg-black">
            <Smile className="text-purple-500" size={14} />
          </div>
          Solana
          <ChevronDown size={20} />
        </Button>
      </div>

      <div className="p-4 md:p-6">
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2 bg-primary text-muted-foreground dark:bg-subtle dark:text-placeholder-foreground"
        >
          {t("invest-now")}
          <HelpingHand size={16} />
        </Button>
      </div>

      <div className="rounded-bl-lg rounded-br-lg border dark:bg-primary-foreground">
        <div className="flex justify-between px-4 py-[14px] text-sm font-medium text-disabled-foreground dark:text-muted-foreground md:px-6">
          <p>{t("you-invested")}</p>
          <span className="font-semibold">R$ 420,00</span>
        </div>
        <div className="flex justify-between px-4 pb-2 pt-4 md:px-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">{t("raised-value")}</span>
            <span className="font-semibold md:text-xl">R$ 666,69</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-right text-sm font-medium">Total</span>
            <span className="font-semibold md:text-xl">R$ 69.420</span>
          </div>
        </div>

        <div className="p-4 md:px-6">
          <Progress indicatorColor="bg-facto-primary" value={33} />
        </div>

        <div className="flex justify-between border-b border-t px-4 py-[14px] text-sm md:px-6">
          <p>{t("offer-status")}</p>
          <Badge variant="secondary" className="rounded-md">
            {t("in-fundraising")}
          </Badge>
        </div>

        <div className="flex justify-between border-b px-4 py-[14px] text-sm md:px-6">
          <p>{t("payment-frequency")}</p>
          <span className="font-semibold">{t("monthly")}</span>
        </div>

        <div className="flex justify-between px-4 py-[14px] text-sm md:px-6">
          <p>{t("receive-in", { installments })}</p>
          <span className="font-semibold">{t("date", { date })}</span>
        </div>
      </div>
    </aside>
  );
}
