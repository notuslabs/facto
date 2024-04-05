"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";
import { parseUnits } from "@/lib/parse-units";

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

      const tx = await program.methods
        .depositTokens(parseUnits(amount))
        .accounts({
          investor: investorPubKey,
          investorStableTokenAccount: investorTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
          stableCoin: FAKE_MINT,
        })
        .rpc();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
  });
}
