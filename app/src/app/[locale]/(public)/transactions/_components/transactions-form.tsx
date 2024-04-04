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
import { ArrowUpSquare, Link2, PlusSquare } from "lucide-react";
import DisclaimerCard from "@/components/disclaimer-card";
import { cn } from "@/lib/utils";

interface TransactionsFormProps {
  type: "deposit" | "withdrawal";
  balance: number | null | undefined;
  publicKey?: PublicKey | undefined | null;
  isModal?: boolean;
}

const WithdrawalSchema = z.object({
  amount: z.number().positive().int().max(20, "Max 20"),
});

const DepositSchema = z.object({
  amount: z.number().positive().int().max(20, "Max 20"),
});

export default function TransactionsForm({
  type,
  balance,
  publicKey,
  isModal,
}: TransactionsFormProps) {
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
  const contract = "00299277837662juijha88722099221443545656756889789345csdfsd23534523jkh34b5kuh2";

  function onSubmit(values: z.infer<typeof schemaType>) {
    if (!publicKey) return;

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
          {t("your-balance")} <span className="font-bold">{formatNumber(balance ?? 0)}</span>
        </span>
      </form>

      {isModal && (
        <>
          <div className="">
            Your key
            <Input
              className="text-ellipsis"
              type="text"
              name="deposit-contract"
              id="deposit-contract"
              disabled
              value={contract}
              leftIcon={Link2}
            />
          </div>
          <DisclaimerCard background={false} />
        </>
      )}

      {type === "withdrawal" && (
        <div
          className={(cn("fixed bottom-[84px] left-0 z-50 w-full px-4"), isModal ? "bottom-0" : "")}
        >
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            variant="defaultGradient"
            disabled={isWithdrawalPending}
          >
            <ArrowUpSquare size={20} />
            {t("withdrawal")}
          </Button>
        </div>
      )}

      {type === "deposit" && (
        <div
          className={(cn("fixed bottom-[84px] left-0 z-50 w-full px-4"), isModal ? "bottom-0" : "")}
        >
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            variant="defaultGradient"
            disabled={isDepositPending}
          >
            <PlusSquare size={20} />
            {t("deposit")}
          </Button>
        </div>
      )}
    </Form>
  );
}
