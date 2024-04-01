import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { ArrowUpSquare, Link2, PlusSquare } from "lucide-react";
import DisclaimerCard from "../disclaimer-card";
import { Button } from "../ui/button";
import BalanceInput from "../balance-input";

interface TransactionModalProps {
  type: "deposit" | "withdrawal";
}

export default function TransactionModal({ type }: TransactionModalProps) {
  const t = useTranslations("transactions-modal");
  const balanceAmount = 69420.11;
  const contract = "00299277837662juijha88722099221443545656756889789345csdfsd23534523jkh34b5kuh2";

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>
          {(type === "deposit" && t("deposit")) || (type === "withdrawal" && t("withdrawal"))}
        </DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
        <div className="flex flex-col gap-3 text-xs">
          {(type === "deposit" && t("deposit-value")) ||
            (type === "withdrawal" && t("withdrawal-value"))}
          <BalanceInput balanceAmount={balanceAmount} />
        </div>
      </div>
      <div className="px-6">
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

      {type === "deposit" && (
        <Button variant="defaultGradient">
          <PlusSquare size={20} />
          {t("deposit")}
        </Button>
      )}
      {type === "withdrawal" && (
        <Button variant="defaultGradient">
          <ArrowUpSquare size={20} />
          {t("withdrawal")}
        </Button>
      )}
    </div>
  );
}
