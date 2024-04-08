import { useMutation } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { claimInstallment } from "@/services/claim-installment";

type UseClaimInstallmentProps = {
  key: string;
};

export function useClaimInstallment({ key }: UseClaimInstallmentProps) {
  const { data } = useProgram();
  const keypair = data?.keypair;
  const program = data?.program;

  return useMutation({
    mutationKey: ["claim-installment", key],
    mutationFn: async (offerId: string) => {
      if (!keypair || !program) throw new Error("No keypair or program");

      return await claimInstallment({ program, caller: keypair, offerId });
    },
  });
}
