"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import DisclaimerCard from "@/components/disclaimer-card";
import { useBalance } from "@/hooks/use-get-balance";
import { ClipboardCopy, Loader2Icon, PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import GoBackButton from "../_components/go-back-button";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/format-number";
import { useWithdrawal } from "@/hooks/use-withdrawal";
import { useProgram } from "@/hooks/use-program";

const WithdrawalSchema = z.object({
  amount: z.number().positive().int(),
});

export default function TransactionsDepositPage() {
  const { data: balance, isPending } = useBalance({ variant: "investor" });
  const { data: programa } = useProgram();
  const {
    mutate: withdrawal,
    isPending: isWithdrawalPending,
    data: transactionHash,
  } = useWithdrawal();
  const t = useTranslations("withdrawal-page");
  const form = useForm<z.infer<typeof WithdrawalSchema>>({
    resolver: zodResolver(WithdrawalSchema),
    defaultValues: {
      amount: 0,
    },
  });
  const publicKey = programa && programa.keypair.publicKey;

  function onSubmit(values: z.infer<typeof WithdrawalSchema>) {
    if (!publicKey) return;
    withdrawal({ amount: values.amount, toTokenAccount: publicKey });
  }

  function handleCopyToClipboard() {
    if (!transactionHash) return;
    copy(transactionHash.toString());
    toast.success(t("address-copied"));
  }

  return (
    <div className="flex h-screen flex-col gap-6">
      <GoBackButton title={t("withdrawal")} />
      <div className="px-4 ">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("withdrawal-value")}
            {isPending ? (
              <Loader2Icon className="animate-spin text-facto-primary" size={24} />
            ) : (
              <Form {...form}>
                <form className="flex flex-col gap-1" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative text-2xl font-semibold">
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 py-2 text-placeholder-foreground"
                            >
                              $
                            </div>
                            <Input
                              className="bg-secondary pl-5 text-2xl font-semibold placeholder:text-placeholder-foreground"
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>
                    {t("your-balance")}{" "}
                    <span className="font-bold">
                      {formatNumber(balance?.formattedBalance ?? 0)}
                    </span>
                  </span>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>

      {transactionHash && (
        <div className="px-6">
          <p className="text-xs text-muted-foreground">{t("address")}</p>
          <div className="flex justify-between gap-16 text-primary">
            <p className="overflow-hidden text-ellipsis text-base font-medium">{transactionHash}</p>
            <ClipboardCopy
              className="min-w-fit cursor-pointer hover:opacity-50"
              size={24}
              onClick={handleCopyToClipboard}
            />
          </div>
        </div>
      )}

      <DisclaimerCard background />

      <div className="fixed bottom-[84px] left-0 z-50 w-full px-4">
        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          variant="defaultGradient"
          disabled={isWithdrawalPending}
        >
          <PlusSquare size={20} />
          {t("withdrawal")}
        </Button>
      </div>
    </div>
  );
}
