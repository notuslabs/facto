/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { getInvestorInvestments } from "@/services/get-investor-investments";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";

export function useInvestorInvestments() {
  const { data } = useProgram();

  return useQuery({
    queryKey: ["investor-investments", data?.keypair.publicKey.toString()],
    enabled: !!data?.keypair,
    queryFn: async () => {
      if (!data?.keypair) return null;

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), data.keypair.publicKey.toBuffer()],
        data.program.programId,
      );

      const investorInvestments = await getInvestorInvestments({
        investorPubKey,
      });

      return {
        investorInvestments,
      };
    },
  });
}
