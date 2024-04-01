"use client";

import BalanceInput from "@/components/balance-input";
import DisclaimerCard from "@/components/disclaimer-card";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TransactionsWithdrawalPage() {
  const t = useTranslations("withdrawal-page");
  const balanceAmount = 666123;
  const contract = "00299277837662juijha88722099221443545656756889789345csdfsd23534523jkh34b5kuh2";
  return (
    <div className="flex h-screen flex-col gap-6">
      <div className="px-4 pt-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("withdrawal-value")}
            <BalanceInput balanceAmount={balanceAmount} />
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
