"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useRouter } from "@/navigation";
import { createOffer } from "@/services/create-offer";
import { useAccounts } from "./use-accounts";
import { CreateOfferFormSchema } from "@/app/[locale]/offers/create/_components/offer-form-validation";
import { useSession } from "./use-session";
import { useProgram2 } from "./use-program";

class OriginatorAccountNotFound extends Error {
  constructor() {
    super();
  }
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { data: programData } = useProgram2();
  const { data: accounts } = useAccounts();
  const t = useTranslations("create-offer-page");
  const router = useRouter();

  const solanaWallet = data?.solanaWallet;
  const program = programData?.program;

  return useMutation({
    mutationFn: async ({
      // step-1
      name,
      description,
      creditScore,
      // step-2
      goalAmount,
      interestRatePercent,
      // step-3
      startDate,
      deadlineDate,
      payment_frequency,
      installmentsStartDate,
      installmentsTotal,
      minAmountInvest,
    }: z.infer<typeof CreateOfferFormSchema>) => {
      if (!solanaWallet || !program) return null;

      if (!accounts?.originatorAccount) {
        throw new OriginatorAccountNotFound();
      }

      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const { id } = await createOffer({
        program,
        caller: loggedUserWallet,
        deadlineDate,
        description,
        goalAmount,
        interestRatePercent,
        installmentsStartDate,
        installmentsTotal,
        minAmountInvest,
        startDate,
      });

      return id;
    },
    onSuccess: async (createdOfferId) => {
      if (createdOfferId == null) return;

      toast.success(t("success-toast-message"));

      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });

      router.push({
        pathname: "/offers/[id]",
        params: { id: createdOfferId },
      });
    },
    onError: (error) => {
      console.error(error);

      if (error instanceof OriginatorAccountNotFound) {
        toast.error(t("not-an-originator"));
        return;
      }

      toast.error(t("error-toast-message"));
    },
  });
}
