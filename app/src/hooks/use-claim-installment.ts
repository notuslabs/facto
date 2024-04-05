import { useMutation } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { claimInstallment } from "@/services/claim-installment";

export function useClaimInstallment() {
  const { data } = useProgram();
  const keypair = data?.keypair;
  const program = data?.program;

  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!keypair || !program) return;

      await claimInstallment({ program, caller: keypair, offerId });
    },
  });
}
