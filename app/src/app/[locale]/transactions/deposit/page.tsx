"use client";

import BalanceInput from "@/components/balance-input";
import DisclaimerCard from "@/components/disclaimer-card";
import { Input } from "@/components/ui/input";
import { useBalance } from "@/hooks/use-get-balance";
import { useProgram } from "@/hooks/use-program";
import { Link2, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";

export default function TransactionsDepositPage() {
  const t = useTranslations("deposit-page");
  const { balance, isLoading } = useBalance();
  const { keypair, program } = useProgram();
  const contract =
    "00299277837662juijha8nicholasotaku872209922144354565675688978thallespassaros9345csdfsd23534523jkh34b5kuh2";
  return (
    <div className="flex h-screen flex-col gap-6">
      <div className="px-4 pt-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("deposit-value")}
            {isLoading && <LoaderIcon className="animate-spin text-facto-primary" size={24} />}
            {!isLoading && <BalanceInput balanceAmount={balance} />}
          </div>
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

      <DisclaimerCard background />
    </div>
  );
}
