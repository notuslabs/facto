import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formatNumber } from "@/lib/format-number";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDeposit } from "@/hooks/use-deposit";
import { useWithdrawal } from "@/hooks/use-withdrawal";
import { useTranslations } from "next-intl";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { ArrowUpSquare, PlusSquare } from "lucide-react";

interface TransactionsFormProps {
  type: "deposit" | "withdrawal";
  balance: number | undefined;
  publicKey?: PublicKey | undefined;
}

const WithdrawalSchema = z.object({
  amount: z.number().positive().int().max(20, "Max 20"),
});

const DepositSchema = z.object({
  amount: z.number().positive().int().max(20, "Max 20"),
});

export default function TransactionsForm({ type, balance, publicKey }: TransactionsFormProps) {
  const { mutate: withdrawal, isPending: isWithdrawalPending } = useWithdrawal();
  const { mutate: deposit, isPending: isDepositPending } = useDeposit();
  const schemaType = type === "deposit" ? DepositSchema : WithdrawalSchema;
  const form = useForm<z.infer<typeof schemaType>>({
    resolver: zodResolver(schemaType),
    defaultValues: {
      amount: 0,
    },
  });
  const t = useTranslations("transactions-form");

  function onSubmit(values: z.infer<typeof schemaType>) {
    if (type === "withdrawal") {
      withdrawal({ amount: values.amount, toTokenAccount: publicKey });
    } else {
      deposit(values.amount);
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-1" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-1 text-2xl font-semibold">
                  R$
                  <Input
                    className="bg-secondary pl-0 text-2xl font-semibold"
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
          {t("your-balance")} <span className="font-bold">{formatNumber(balance ?? 0)}</span>
        </span>
      </form>

      {type === "withdrawal" && (
        <Button
          className="fixed bottom-[84px] z-50 w-full"
          onClick={form.handleSubmit(onSubmit)}
          variant="defaultGradient"
          disabled={isWithdrawalPending}
        >
          <ArrowUpSquare size={20} />
          {t("withdrawal")}
        </Button>
      )}
      {type === "deposit" && (
        <Button
          className="fixed bottom-[84px] z-50 w-full"
          onClick={form.handleSubmit(onSubmit)}
          variant="defaultGradient"
          disabled={isDepositPending}
        >
          <PlusSquare size={20} />
          {t("deposit")}
        </Button>
      )}
    </Form>
  );
}
