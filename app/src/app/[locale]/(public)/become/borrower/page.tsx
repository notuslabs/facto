"use client";

import { Card } from "@/components/card";
import { useTranslations } from "next-intl";
import { BorrowerForm } from "./_components/borrower-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAccounts } from "@/hooks/use-accounts";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "@/navigation";

export default function InvestorFormPage() {
  const { data: tokenAccounts, isPending: isTokenAccountsLoading } = useAccounts();
  const {
    data: sessionData,
    isPending: isSessionLoading,
    isRefetching: isRefetchingSession,
    isFetching: isFetchingSession,
    isLoading: isLoadingSession,
    isStale: isStaleSession,
  } = useSession();
  const t = useTranslations("become.borrower");
  const router = useRouter();

  const isAllowedToCreate = !isTokenAccountsLoading && !tokenAccounts?.borrowerAccount;
  const alreadyHasBorrowerAccount = !isTokenAccountsLoading && !!tokenAccounts?.borrowerAccount;

  useEffect(() => {
    if (alreadyHasBorrowerAccount) {
      toast.error(t("already-registered-toast-message"));
      router.push("/offers/create");
    }
  }, [alreadyHasBorrowerAccount, router, t]);

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

  return (
    <div className="container">
      <Card>
        <h1 className="text-3xl font-medium">{t("title")}</h1>

        <BorrowerForm isLoading={isTokenAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
