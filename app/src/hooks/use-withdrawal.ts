"use client";
import { PublicKey } from "@solana/web3.js";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";
import { parseUnits } from "@/lib/parse-units";

export function useWithdrawal() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async ({
      amount,
      toTokenAccount,
    }: {
      amount: number;
      toTokenAccount: PublicKey;
    }) => {
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
        .withdrawTokens(parseUnits(amount))
        .accounts({
          investor: investorPubKey,
          investorStableTokenAccount: investorTokenAccountPubKey,
          toTokenAccount: toTokenAccount,
          stableCoin: FAKE_MINT,
          payer: keypair.publicKey,
          caller: keypair.publicKey,
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
