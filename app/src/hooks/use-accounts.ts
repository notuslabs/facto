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

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const investorAccount = await program.account.investor
        .fetch(investorPubKey)
        .catch(console.error);
      const borrowerAccount = await program.account.borrower
        .fetch(borrowerPubKey)
        .catch(console.error);

      return {
        investorAccount: investorAccount ?? null,
        borrowerAccount: borrowerAccount ?? null,
      };
    },
    retry: 0,
    enabled: !!keypair && !!program,
  });
}
