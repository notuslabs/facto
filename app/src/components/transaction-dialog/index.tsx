import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useBalance } from "@/hooks/use-get-balance";
import { useProgram } from "@/hooks/use-program";
import SuccessDialog from "./_components/success-dialog";
import { useWithdrawal } from "@/hooks/use-withdrawal";
import { useDeposit } from "@/hooks/use-deposit";
import DisclaimerCard from "../disclaimer-card";
import { ArrowUpSquare, ClipboardCopy, PlusSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formatNumber } from "@/lib/format-number";
import { Input } from "@/components/ui/input";

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
  const t = useTranslations("transactions-modal");
  const { data: balance } = useBalance();
  const { data } = useProgram();
  const {
    mutate: withdrawal,
    isSuccess: isWithdrawalSuccess,
    isPending: isWithdrawalPending,
  } = useWithdrawal();
  const {
    mutate: deposit,
    isSuccess: isDepositSuccess,
    isPending: isDepositPending,
  } = useDeposit();
  const publicKey = data && data.keypair.publicKey;
  const schemaType = type === "deposit" ? DepositSchema : WithdrawalSchema;
  const transactionHash = "0ojnweifjn91723f109nbd0192hd191293nxm010xn1";

  const form = useForm<z.infer<typeof schemaType>>({
    resolver: zodResolver(schemaType),
    defaultValues: {
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof schemaType>) {
    if (type === "withdrawal") {
      withdrawal({ amount: values.amount, toTokenAccount: publicKey });
    } else {
      deposit(values.amount);
    }
  }

  function handleCopyToClipboard() {
    copy(transactionHash.toString());
    toast.success(t("address-copied"));
  }

  return (
    <div className="flex w-[451px] flex-col gap-6">
      {isWithdrawalSuccess || isDepositSuccess ? (
        <SuccessDialog
          operationAmount={444}
          type={type}
          transactionHash={transactionHash}
          externalLink="www.google.com"
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

          <div className="px-6 text-xs text-muted-foreground">
            <p>{t("address")}</p>
            <div className="flex justify-between gap-16">
              <p className="overflow-hidden text-ellipsis text-sm text-placeholder-foreground">
                345345345345
              </p>
              <ClipboardCopy
                className="min-w-fit cursor-pointer hover:opacity-50"
                size={16}
                onClick={handleCopyToClipboard}
              />
            </div>
          </div>
          <DisclaimerCard background />

          {type === "withdrawal" && (
            <div className="w-full bg-primary-foreground p-4">
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
            <div className="w-full bg-primary-foreground p-4">
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
        </>
      )}
    </div>
  );
}
