import { claimOfferInvestments } from "@/services/claim-offer-investments";
import { useMutation } from "@tanstack/react-query";
import { useProgram } from "./use-program";

export function useOfferInvestmentsClaim() {
  const { data } = useProgram();
  const keypair = data?.keypair;
  const program = data?.program;

  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!keypair || !program) return;

      return await claimOfferInvestments({
        offerId,
        caller: keypair,
        program,
      });
    },
  });
}
