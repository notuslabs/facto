"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!keypair || !program) return;

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_stable_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .depositTokens(new BN(amount * 10 ** 9))
        .accounts({
          investor: investorPubKey,
          investorStableTokenAccount: investorTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
          stableCoin: FAKE_MINT,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
  });
}
