import { useState } from "react";
import { Input } from "../ui/input";
import { formatNumber } from "@/lib/format-number";
import { useTranslations } from "next-intl";

interface BalanceInputProps {
  balanceAmount: number | undefined;
}

export default function BalanceInput({ balanceAmount }: BalanceInputProps) {
  const [transactionValue, setTransactionValue] = useState<number | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const t = useTranslations("transactions-modal");

  function handleValueClick() {
    setShowInput(true);
  }

  function handleTransactionValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTransactionValue(parseFloat(event.target.value));
  }

  function handleInputBlur() {
    setShowInput(false);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      setShowInput(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className="cursor-pointer text-2xl font-semibold text-placeholder-foreground"
        onClick={handleValueClick}
      >
        {showInput ? (
          <Input
            autoFocus
            type="number"
            value={transactionValue !== null ? transactionValue : ""}
            onChange={handleTransactionValueChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          formatNumber(transactionValue !== null ? transactionValue : 0)
        )}
      </span>
      <span>
        {t("your-balance")} <span className="font-bold">{formatNumber(balanceAmount ?? 0)}</span>
      </span>
    </div>
  );
}
