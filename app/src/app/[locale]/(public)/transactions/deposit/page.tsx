"use client";

import DisclaimerCard from "@/components/disclaimer-card";
import { Input } from "@/components/ui/input";
import { useBalance } from "@/hooks/use-get-balance";
import { Link2, Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import GoBackButton from "../_components/go-back-button";
import TransactionsForm from "../_components/transactions-form";

export default function TransactionsDepositPage() {
  const { data, isPending } = useBalance({ variant: "investor" });
  const t = useTranslations("deposit-page");

  const contract =
    "00299277837662juijha8nicholasotaku872209922144354565675688978thallespassaros9345csdfsd23534523jkh34b5kuh2";

  return (
    <div className="flex h-screen flex-col gap-6">
      <GoBackButton title={t("deposit")} />
      <div className="px-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("deposit-value")}
            {isPending ? (
              <Loader2Icon className="animate-spin text-facto-primary" size={24} />
            ) : (
              <TransactionsForm type="deposit" balance={data?.formattedBalance} />
            )}
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
        </div>
      </div>

      <DisclaimerCard background />
    </div>
  );
}
