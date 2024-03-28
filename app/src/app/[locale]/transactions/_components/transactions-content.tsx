import { Link } from "@/navigation";
import { ArrowUpSquare, PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TransactionsContent() {
  const t = useTranslations("transactions-page");
  const balanceTotal = "439.238,13";
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-xs text-muted-foreground">{t("your-balance")}</span>
        <span className="text-3xl font-extrabold">R$ {balanceTotal}</span>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/transactions/deposit"
          className="flex flex-col items-center gap-2 rounded-2xl border border-border-hover p-8 dark:bg-[#252529]"
        >
          <PlusSquare size={24} className="text-facto-primary" />
          <span className="text-lg font-medium">{t("deposit")}</span>
        </Link>

        <Link
          href="/transactions/withdrawal"
          className="flex flex-col items-center gap-2 rounded-2xl border border-border-hover p-8 dark:bg-[#252529]"
        >
          <ArrowUpSquare size={24} className="text-facto-primary" />
          <span className="text-lg font-medium">{t("withdrawal")}</span>
        </Link>
      </div>
    </div>
  );
}
