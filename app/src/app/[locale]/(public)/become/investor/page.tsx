"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { InvestorForm } from "./_components/investor-form";
import { useTokenAccounts } from "@/hooks/use-token-accounts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSession } from "@/hooks/use-session";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isPending: isTokenAccountsLoading } = useTokenAccounts();
  const {
    data: sessionData,
    isPending: isSessionLoading,
    isRefetching: isRefetchingSession,
    isFetching: isFetchingSession,
    isLoading: isLoadingSession,
    isStale: isStaleSession,
  } = useSession();
  const t = useTranslations("become.investor");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.investorTokenAccount;
  const alreadyHasInvestorAccount =
    !isTokenAccountsLoading && !!tokenAccounts?.investorTokenAccount;

  useEffect(() => {
    if (alreadyHasInvestorAccount) {
      toast.error(t("already-registered-toast-message"));
      router.push("/");
    }
  }, [alreadyHasInvestorAccount, router, t]);

  useEffect(() => {
    if (
      !sessionData?.userInfo &&
      !isSessionLoading &&
      !isRefetchingSession &&
      !isFetchingSession &&
      !isLoadingSession &&
      !isStaleSession
    ) {
      toast.error(t("not-authenticated"));
      router.push("/");
    }
  }, [
    isSessionLoading,
    isFetchingSession,
    isLoadingSession,
    isRefetchingSession,
    isStaleSession,
    sessionData?.userInfo,
    t,
    router,
  ]);

  // TODO: block not authed user

  return (
    <div className="container">
      <Card>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <InvestorForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
