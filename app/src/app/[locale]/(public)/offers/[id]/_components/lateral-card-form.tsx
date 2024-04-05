"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useInvest } from "@/hooks/use-invest";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, HelpingHand, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CreateDepositOfferFormSchemaProps = {
  balance?: number | null;
  offerRemaining: number;
  minAmountInvest?: number;
};

const CreateDepositOfferFormSchema = ({
  balance,
  offerRemaining,
  minAmountInvest = 1,
}: CreateDepositOfferFormSchemaProps) =>
  z.object({
    amount: z.coerce
      .number()
      .positive("Invesment amount must be greater than 0")
      .refine((val) => val <= (balance ?? 0), "You can't deposit more than your balance")
      .refine((val) => val <= offerRemaining, "You can't deposit more than needed for offer to end")
      .refine((val) => val >= minAmountInvest, "You can't deposit less than the minimum amount"),
  });

type LateralCardProps = {
  offerId: string;
  balance?: number | null;
  offerRemaining: number;
  minAmountInvest?: number;
  isLoadingBalance: boolean;
};

export function LateralCardForm({
  offerId,
  balance,
  isLoadingBalance,
  offerRemaining,
  minAmountInvest,
}: LateralCardProps) {
  const { mutate: invest, isPending: isInvesting } = useInvest();
  const formatNumber = useFormatNumber();
  const t = useTranslations("offer-page.lateral-card");

  const DepositOfferFormSchema = CreateDepositOfferFormSchema({
    balance,
    offerRemaining,
    minAmountInvest,
  });

  const form = useForm<z.infer<typeof DepositOfferFormSchema>>({
    resolver: zodResolver(DepositOfferFormSchema),
    mode: "onChange",
  });

  function topUp() {
    if (balance == null) return;

    form.setValue("amount", balance);
  }

  async function onSubmit(values: z.infer<typeof DepositOfferFormSchema>) {
    invest(
      {
        amount: values.amount,
        offerId: offerId,
      },
      {
        onSuccess: ({ tx }) => {
          toast.success(t("investment-success"), {
            action: (() => (
              <a
                href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                {t("view-transaction")}
              </a>
            ))(),
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
            <Image
              src="/usdc-logo.png"
              width={20}
              height={20}
              alt="USDC"
              className="size-5 rounded-full bg-black"
            />
            Fake USDC
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

            {(isLoadingBalance || balance != null) && (
              <p className="flex items-center gap-1 whitespace-nowrap text-xs text-primary">
                {t("your-balance")}
                {isLoadingBalance ? (
                  <span>
                    <Loader2 strokeWidth={2} size={12} className="animate-spin" />
                  </span>
                ) : (
                  balance != null && (
                    <button onClick={topUp} className="font-bold underline underline-offset-2">
                      {formatNumber({ value: balance ?? 0 })}
                    </button>
                  )
                )}
              </p>
            )}
          </div>
          <Button
            disabled={true}
            className="hidden gap-2 bg-subtle text-placeholder-foreground md:flex"
          >
            <Image
              src="/usdc-logo.png"
              width={20}
              height={20}
              alt="USDC"
              className="size-5 rounded-full bg-black"
            />
            Fake USDC
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
