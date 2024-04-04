import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useBalance } from "@/hooks/use-get-balance";
import { useProgram } from "@/hooks/use-program";
import TransactionsForm from "@/app/[locale]/(public)/transactions/_components/transactions-form";

interface TransactionModalProps {
  type: "deposit" | "withdrawal";
}

export default function TransactionModal({ type }: TransactionModalProps) {
  const t = useTranslations("transactions-modal");
  const { data: balance } = useBalance({ variant: "investor" });
  const { data } = useProgram();
  const publicKey = data && data.keypair.publicKey;

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
          {type === "deposit" ? t("deposit-value") : t("withdrawal-value")}
          <TransactionsForm
            balance={balance?.formattedBalance}
            isModal
            type={type}
            publicKey={publicKey}
          />
        </div>
      </div>
    </div>
  );
}
