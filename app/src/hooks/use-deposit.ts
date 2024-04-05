"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "./use-program";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!keypair || !program) return null;

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_stable_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      const { tx } = await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({ address: investorTokenAccountPubKey, amount }),
      }).then((res) => res.json());

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
  });
}
