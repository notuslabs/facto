import { Button } from "@/components/ui/button";
import { usePayOffer } from "@/hooks/use-pay-offer";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type PayButtonProps = {
  id: string;
  index: number;
  disable: boolean;
  className?: string;
  amount: number;
};

export function PayButton({ id, index, disable, className, amount }: PayButtonProps) {
  const t = useTranslations("installments-page");

  const { mutate: payOffer, isPending } = usePayOffer(`${id}-${index}`);

  return (
    <Button
      size="sm"
      className={cn(
        "mr-4 disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground",
        className,
      )}
      disabled={disable || isPending}
      onClick={() => payOffer({ offerId: id, amount })}
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <CircleDollarSign size={16} />}
      {t("pay")}
    </Button>
  );
}
