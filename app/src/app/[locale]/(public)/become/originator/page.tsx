"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { OriginatorForm } from "./_components/originator-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAccounts } from "@/hooks/use-accounts";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "@/navigation";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isPending: isTokenAccountsLoading } = useAccounts();
  const { data: sessionData, isPending: isSessionLoading } = useSession();
  const t = useTranslations("become.originator");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.originatorAccount;
  const alreadyHasOriginatorAccount = !isTokenAccountsLoading && !!tokenAccounts?.originatorAccount;

  useEffect(() => {
    if (alreadyHasOriginatorAccount) {
      toast.error(t("already-registered-toast-message"));
      router.push("/offers/create");
    }
  }, [alreadyHasOriginatorAccount, router, t]);

  useEffect(() => {
    if (!sessionData?.userInfo && !isSessionLoading) {
      toast.error(t("not-authenticated"));
      router.push("/");
    }
  }, [isSessionLoading, sessionData?.userInfo, t, router]);

  return (
    <div className="container">
      <Card>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <OriginatorForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
