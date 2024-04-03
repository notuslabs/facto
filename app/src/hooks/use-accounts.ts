"use client";

import { utils } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./use-program";

export function useAccounts() {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["accounts", keypair?.publicKey.toString(), program?.programId.toString()],
    queryFn: async () => {
      if (!keypair || !program) return null;

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), keypair.publicKey.toBuffer()],
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
    enabled: !!keypair && !!program,
  });
}
