import { Input } from "@/components/ui/input";
import { Info, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TransactionsDepositPage() {
  const t = useTranslations("deposit-page");
  const balanceAmount = "R$ 69.420,11";
  const contract = "00299277837662juijha88722099221443545656756889789345csdfsd23534523jkh34b5kuh2";
  return (
    <div className="flex h-screen flex-col gap-6">
      <div className="px-4 pt-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-secondary p-6">
          <div className="flex flex-col gap-3 text-xs">
            {t("deposit-value")}
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-placeholder-foreground">R$ {0}</span>
              <span>
                {t("your-balance")} <span className="font-bold">{balanceAmount}</span>
              </span>
            </div>
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

      <div className="h-full rounded-3xl bg-primary-foreground p-4">
        <div className="flex items-center gap-2 rounded-lg border border-muted-foreground p-6 ">
          <Info className="text-facto-primary" size={20} />
          <span className="text-xs text-muted-foreground">{t("disclaimer")}</span>
        </div>
      </div>
    </div>
  );
}
