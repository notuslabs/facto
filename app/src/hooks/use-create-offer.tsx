"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useRouter } from "@/navigation";
import { createOffer } from "@/services/create-offer";
import { useAccounts } from "./use-accounts";
import { useProgram } from "./use-program";
import { CreateOfferFormSchema } from "@/app/[locale]/(authed)/admin/offers/create/_components/offer-form-validation";
import { buttonVariants } from "@/components/ui/button";

class BorrowerAccountNotFound extends Error {
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
      if (!keypair || !program) throw new Error("null keypair");

      if (!accounts?.borrowerAccount) {
        throw new BorrowerAccountNotFound();
      }

      const { id, tx } = await createOffer({
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

      return { id, tx };
    },
    onSuccess: async ({ id, tx }) => {
      toast.success(t("success-toast-message"), {
        action: (() => (
          <a
            href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("view-transaction")}
          </a>
        ))(),
      });

      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });

      router.push({
        pathname: "/offers/[id]",
        params: { id },
      });
    },
    onError: (error) => {
      console.error(error.message);
      // if (error instanceof BorrowerAccountNotFound) {
      //   toast.error(t("not-an-borrower"));
      //   return;
      // }

      toast.error(error.message);
      // toast.error(t("error-toast-message"));
    },
  });
}
