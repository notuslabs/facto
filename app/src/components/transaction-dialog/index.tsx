import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useBalance } from "@/hooks/use-get-balance";
import { useProgram } from "@/hooks/use-program";
import SuccessDialog from "./_components/success-dialog";
import { useWithdrawal } from "@/hooks/use-withdrawal";
import { useDeposit } from "@/hooks/use-deposit";
import DisclaimerCard from "../disclaimer-card";
import { ArrowUpSquare, ClipboardCopy, Loader2, PlusSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formatNumber } from "@/lib/format-number";
import { Input } from "@/components/ui/input";
import { useTokenAccounts } from "@/hooks/use-token-accounts";

interface TransactionDialogProps {
  type: "deposit" | "withdrawal";
}

const WithdrawalSchema = z.object({
  amount: z.number().positive().int(),
});

const DepositSchema = z.object({
  amount: z.number().positive().int(),
});

export default function TransactionDialog({ type }: TransactionDialogProps) {
  const t = useTranslations("transactions-dialog");
  const { data: balance } = useBalance({ variant: "investor" });
  const { data } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const {
    mutate: withdrawal,
    isSuccess: isWithdrawalSuccess,
    isPending: isWithdrawalPending,
    data: withdrawalTransactionHash,
  } = useWithdrawal();
  const {
    mutate: deposit,
    isSuccess: isDepositSuccess,
    isPending: isDepositPending,
    data: depositTransactionHash,
  } = useDeposit();

  const schemaType = type === "deposit" ? DepositSchema : WithdrawalSchema;

  const form = useForm<z.infer<typeof schemaType>>({
    resolver: zodResolver(schemaType),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = form.watch("amount");

  async function onSubmit(values: z.infer<typeof schemaType>) {
    if (type === "withdrawal" && tokenAccounts?.userTokenAccount.address) {
      withdrawal({
        amount: values.amount,
        toTokenAccount: tokenAccounts?.userTokenAccount.address,
      });
    } else {
      deposit(values.amount);
    }
  }

  function handleCopyToClipboard() {
    if (type === "deposit" && depositTransactionHash) {
      copy(depositTransactionHash);
      return;
    }
    if (withdrawalTransactionHash) {
      copy(withdrawalTransactionHash);
    }

    toast.success(t("address-copied"));
  }

  function handleCopyAddress() {
    if (type === "deposit" && tokenAccounts?.investorTokenAccount?.address) {
      copy(tokenAccounts?.investorTokenAccount.address.toString());
      return;
    }
    if (tokenAccounts?.userTokenAccount.address) {
      copy(tokenAccounts?.userTokenAccount.address.toString());
    }

    toast.success(t("address-copied"));
  }

  return (
    <div className="flex w-[451px] flex-col gap-6">
      {isWithdrawalSuccess || isDepositSuccess ? (
        <SuccessDialog
          operationAmount={amount}
          type={type}
          transactionHash={type === "deposit" ? depositTransactionHash : withdrawalTransactionHash}
          copyToClipboard={handleCopyToClipboard}
        />
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {(type === "deposit" && t("deposit")) || (type === "withdrawal" && t("withdrawal"))}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
            <div className="flex flex-col gap-3 text-xs">
              {type === "deposit" ? t("deposit-value") : t("withdrawal-value")}
              <div className="flex flex-col gap-6 rounded-2xl bg-secondary">
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
              </div>
            </div>
          </div>

          {tokenAccounts?.investorTokenAccount?.address.toString() ||
          tokenAccounts?.userTokenAccount.address.toString() ? (
            <div className="px-6 text-xs text-muted-foreground">
              <p>{t("address")}</p>
              <div className="flex justify-between gap-16">
                <p className="overflow-hidden text-ellipsis text-sm text-placeholder-foreground">
                  {type === "deposit"
                    ? tokenAccounts?.investorTokenAccount?.address.toString()
                    : tokenAccounts?.userTokenAccount.address.toString()}
                </p>
                <ClipboardCopy
                  className="min-w-fit cursor-pointer hover:opacity-50"
                  size={16}
                  onClick={handleCopyAddress}
                />
              </div>
            </div>
          ) : null}

          <DisclaimerCard background />

          {type === "withdrawal" && (
            <div className="w-full bg-primary-foreground p-4">
              <Button
                className="w-full"
                onClick={form.handleSubmit(onSubmit)}
                variant="defaultGradient"
                disabled={isWithdrawalPending}
              >
                {isWithdrawalPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ArrowUpSquare size={20} />
                )}
                {t("withdrawal")}
              </Button>
            </div>
          )}

          {type === "deposit" && (
            <div className="w-full bg-primary-foreground p-4">
              <Button
                className="w-full"
                onClick={form.handleSubmit(onSubmit)}
                variant="defaultGradient"
                disabled={isDepositPending}
              >
                {isDepositPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <PlusSquare size={20} />
                )}
                {t("deposit")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
