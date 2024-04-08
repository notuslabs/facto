import { claimOfferInvestments } from "@/services/claim-offer-investments";
import { useMutation } from "@tanstack/react-query";
import { useProgram } from "./use-program";

type UseOfferInvestmentsClaimProps = {
  key: string;
};

export function useOfferInvestmentsClaim({ key }: UseOfferInvestmentsClaimProps) {
  const { data } = useProgram();
  const keypair = data?.keypair;
  const program = data?.program;

  return useMutation({
    mutationKey: ["claim-investments", key],
    mutationFn: async (offerId: string) => {
      if (!keypair || !program) throw new Error("No keypair or program");

      return await claimOfferInvestments({
        offerId,
        caller: keypair,
        program,
      });
    },
  });
}
