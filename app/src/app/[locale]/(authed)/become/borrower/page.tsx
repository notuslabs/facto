"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { BorrowerForm } from "./_components/borrower-form";
import { useEffect } from "react";
import { useAccounts } from "@/hooks/use-accounts";
import { useRouter } from "@/navigation";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isPending: isTokenAccountsLoading } = useAccounts();

  const t = useTranslations("become.borrower");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.borrowerAccount;
  const alreadyHasBorrowerAccount = !isTokenAccountsLoading && !!tokenAccounts?.borrowerAccount;

  useEffect(() => {
    if (alreadyHasBorrowerAccount) {
      router.replace("/admin/offers");
    }
  }, [alreadyHasBorrowerAccount, router, t]);

  return (
    <div className="container">
      <Card withTexture>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <BorrowerForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
