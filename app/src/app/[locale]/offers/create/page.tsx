"use client";

import { Card } from "@/components/card";
import { OfferForm } from "./_components/offer-form";
import { useAccounts } from "@/hooks/use-accounts";
import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function CreateOfferPage() {
  const { data: accounts, isPending: isAccountsLoading } = useAccounts();
  const router = useRouter();
  const t = useTranslations("create-offer-page");

  const isAllowedToCreate = !isAccountsLoading && !!accounts?.originatorAccount;
  const notOriginator = !isAccountsLoading && !accounts?.originatorAccount;

  // console.log({
  //   notAuthed,
  //   notOriginator,
  // });

  // console.log({
  //   isAccountsLoading,
  //   accounts,
  // });

  useEffect(() => {
    if (notOriginator) {
      toast.error(t("not-an-originator"));
      // router.push("/become/originator");
    }
  }, [notOriginator, router, t]);

  // TODO: block not authed user
  // useEffect(() => {
  //   if (notAuthed) {
  //     toast.error(t("not-authenticated"));
  //     // router.push("/");

  //     return;
  //   }
  // }, [notAuthed, router, t]);

  return (
    <div className="container">
      <Card className="w-full">
        <OfferForm isLoading={isAccountsLoading} isAllowedToCreate={isAllowedToCreate} />
      </Card>
    </div>
  );
}
