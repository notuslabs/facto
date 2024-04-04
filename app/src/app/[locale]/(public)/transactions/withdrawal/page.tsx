"use client";

import DisclaimerCard from "@/components/disclaimer-card";
import { Input } from "@/components/ui/input";
import { useBalance } from "@/hooks/use-get-balance";
import { Link2, Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProgram } from "@/hooks/use-program";
import GoBackButton from "../_components/go-back-button";
import TransactionsForm from "../_components/transactions-form";

export default function TransactionsWithdrawalPage() {
  const t = useTranslations("withdrawal-page");
  const { data: balance, isPending } = useBalance({ variant: "investor" });
  const { data } = useProgram();
  const publicKey = data && data.keypair.publicKey;
  const contract = "00299277837662juijha88722099221443545656756889789345csdfsd23534523jkh34b5kuh2";

  return (
    <div className="flex h-screen flex-col gap-6">
      <GoBackButton title={t("withdrawal")} />
      <div className="px-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("withdrawal-value")}
            {isPending ? (
              <Loader2Icon className="animate-spin text-facto-primary" size={24} />
            ) : (
              <TransactionsForm
                publicKey={publicKey}
                balance={balance?.formattedBalance}
                type="withdrawal"
              />
            )}
          </div>
          <Input
            className="text-ellipsis"
            type="text"
            name="withdrawal-contract"
            id="withdrawal-contract"
            disabled
            value={contract}
            leftIcon={Link2}
          />
        </div>
      </div>

      <DisclaimerCard background />
    </div>
  );
}
