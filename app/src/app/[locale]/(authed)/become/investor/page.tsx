"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { InvestorForm } from "./_components/investor-form";
import { useTokenAccounts } from "@/hooks/use-token-accounts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isPending: isTokenAccountsLoading } = useTokenAccounts();
  const t = useTranslations("become.investor");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.investorTokenAccount;
  const alreadyHasInvestorAccount =
    !isTokenAccountsLoading && !!tokenAccounts?.investorTokenAccount;

  useEffect(() => {
    if (alreadyHasInvestorAccount) {
      toast.error(t("already-registered-toast-message"));
      router.replace("/");
    }
  }, [alreadyHasInvestorAccount, router, t]);

  return (
    <div className="container">
      <Card withTexture>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <InvestorForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
