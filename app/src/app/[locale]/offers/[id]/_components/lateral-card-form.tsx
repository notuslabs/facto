"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useInvest } from "@/hooks/use-invest";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, HelpingHand, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const DepositOfferFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Invesment amount must be greater than 0")
    .int("Invesment amount must be an integer"),
});

type LateralCardProps = {
  offerId: string;
  balance?: number | null;
  isLoadingBalance: boolean;
};

export function LateralCardForm({ offerId, balance, isLoadingBalance }: LateralCardProps) {
  const { mutate: invest, isPending: isInvesting } = useInvest();
  const formatNumber = useFormatNumber();
  const t = useTranslations("offer-page.lateral-card");

  const form = useForm<z.infer<typeof DepositOfferFormSchema>>({
    resolver: zodResolver(DepositOfferFormSchema),
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof DepositOfferFormSchema>) {
    invest(
      {
        amount: values.amount,
        offerId: offerId,
      },
      {
        onSuccess: () => {
          toast.success(t("investment-success"), {
            action: (() => <Button variant="outline">{t("view-transaction")}</Button>)(),
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4">
          <Button className="flex gap-2 bg-subtle text-placeholder-foreground md:hidden">
            <div className="flex size-5 items-center justify-center rounded-full bg-black"></div>
            Fake Token
            <ChevronDown size={20} />
          </Button>
        </div>

        <div className="flex justify-between px-4 md:p-6">
          <div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="bg-transparent  pl-4 text-2xl font-semibold placeholder:text-placeholder-foreground"
                        placeholder="0"
                        disabled={isInvesting}
                        {...field}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-semibold text-placeholder-foreground"
                      >
                        $
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isLoadingBalance || balance) && (
              <p className="flex items-center gap-1 whitespace-nowrap text-xs text-primary">
                {t("your-balance")}
                {isLoadingBalance ? (
                  <span>
                    <Loader2 strokeWidth={2} size={12} className="animate-spin" />
                  </span>
                ) : (
                  balance && (
                    <span className="font-bold underline underline-offset-2">
                      {formatNumber({ value: balance ?? 0 })}
                    </span>
                  )
                )}
              </p>
            )}
          </div>
          <Button
            disabled={true}
            className="hidden gap-2 bg-subtle text-placeholder-foreground md:flex"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-black"></div>
            Fake Token
            <ChevronDown size={20} />
          </Button>
        </div>

        <div className="p-4 md:p-6">
          <Button
            size="lg"
            type="submit"
            variant="outline"
            className="w-full hover:bg-subtle"
            disabled={isInvesting}
          >
            {t("invest-now")}
            {isInvesting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <HelpingHand size={16} />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
