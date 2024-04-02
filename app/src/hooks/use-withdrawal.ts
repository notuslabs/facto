"use client";
import { PublicKey } from "@solana/web3.js";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { FAKE_MINT } from "@/lib/constants";
import { useSession } from "./use-session";
import { useProgram } from "./use-program";

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
      if (!keypair || !program) return;

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .withdrawTokens(new BN(amount * 10 ** 9))
        .accounts({
          investor: investorPubKey,
          investorTokenAccount: investorTokenAccountPubKey,
          toTokenAccount: toTokenAccount,
          stableCoin: FAKE_MINT,
          payer: keypair.publicKey,
          caller: keypair.publicKey,
        })
        .rpc()
        .catch((e) => console.log(e));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
  });
}
