"use client";

import { utils } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useSession } from "./use-session";
import { useProgram2 } from "./use-program";

export function useAccounts() {
  const { data: programData } = useProgram2();
  const { data } = useSession();

  const solanaWallet = data?.solanaWallet;
  const address = data?.address;
  const program = programData?.program;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["accounts", address?.toString(), program?.programId.toString()],
    queryFn: async () => {
      if (!solanaWallet || !program) return null;

      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
        program.programId,
      );

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), loggedUserWallet.publicKey.toBuffer()],
        program.programId,
      );

      const investorAccount = await program.account.investor
        .fetch(investorPubKey)
        .catch(console.error);
      const originatorAccount = await program.account.originator
        .fetch(originatorPubKey)
        .catch(console.error);

      return {
        investorAccount: investorAccount ?? null,
        originatorAccount: originatorAccount ?? null,
      };
    },
    retry: 0,
    enabled: !!solanaWallet && !!program,
  });
}
