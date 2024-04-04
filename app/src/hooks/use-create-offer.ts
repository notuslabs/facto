"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useRouter } from "@/navigation";
import { createOffer } from "@/services/create-offer";
import { useAccounts } from "./use-accounts";
import { useProgram } from "./use-program";
import { CreateOfferFormSchema } from "@/app/[locale]/(admin)/offers/create/_components/offer-form-validation";

class OriginatorAccountNotFound extends Error {
  constructor() {
    super();
  }
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();
  const { data: accounts } = useAccounts();
  const t = useTranslations("create-offer-page");
  const router = useRouter();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async ({
      // step-1
      description,
      // creditScore,
      // step-2
      goalAmount,
      interestRatePercent,
      // step-3
      startDate,
      deadlineDate,
      // payment_frequency,
      installmentsStartDate,
      installmentsCount,
      minAmountInvest,
    }: z.infer<typeof CreateOfferFormSchema>) => {
      if (!keypair || !program) return null;

      if (!accounts?.originatorAccount) {
        throw new OriginatorAccountNotFound();
      }

      const { id } = await createOffer({
        program,
        caller: keypair,
        deadlineDate,
        description,
        goalAmount,
        installmentsTotalAmount: goalAmount + goalAmount * (interestRatePercent / 100),
        installmentsStartDate,
        installmentsCount,
        minAmountInvest,
        startDate,
      });

      return id;
    },
    onSuccess: async (createdOfferId) => {
      if (createdOfferId == null) return;

      toast.success(t("success-toast-message"));

      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });

      router.push({
        pathname: "/offers/[id]",
        params: { id: createdOfferId },
      });
    },
    onError: (error) => {
      console.error(error.message);
      // if (error instanceof OriginatorAccountNotFound) {
      //   toast.error(t("not-an-originator"));
      //   return;
      // }

      toast.error(error.message);
      // toast.error(t("error-toast-message"));
    },
  });
}
