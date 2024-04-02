import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { TokenAccountNotFoundError, getAccount } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";

export function useInvestorTokenAccount() {
  const { data: programData } = useProgram();
  const keypair = programData?.keypair;
  const program = programData?.program;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["investor-token-account", keypair?.publicKey.toString()],
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 20,
    queryFn: async () => {
      if (!keypair || !program) {
        return null;
      }

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      console.log({
        investorTokenAccountPubKey: investorTokenAccountPubKey.toString(),
      });

      const investorTokenAccount = await getAccount(
        programData.program.provider.connection,
        investorTokenAccountPubKey,
      ).catch((error) => {
        if (error instanceof TokenAccountNotFoundError) {
          return null;
        }

        throw error;
      });

      return {
        investorTokenAccount,
      };
    },
  });
}
