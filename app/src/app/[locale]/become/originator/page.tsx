"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { OriginatorForm } from "./_components/originator-form";
import { useTokenAccounts } from "@/hooks/use-token-accounts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isLoading: isTokenAccountsLoading } = useTokenAccounts();
  const t = useTranslations("become.originator");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.originatorTokenAccount;
  const alreadyHasOriginatorAccount =
    !isTokenAccountsLoading && !!tokenAccounts?.originatorTokenAccount;

  useEffect(() => {
    if (alreadyHasOriginatorAccount) {
      toast.error(t("already-registered-toast-message"));
      router.push("/");
    }
  }, [alreadyHasOriginatorAccount, router, t]);

  // TODO: block not authed user

  return (
    <div className="container">
      <Card>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <OriginatorForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
