"use client";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { FAKE_MINT } from "@/lib/constants";
import { useSession } from "./use-session";
import { useProgram } from "./use-program";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { data: programData } = useProgram();

  const solanaWallet = data?.solanaWallet;
  const program = programData?.program;

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!solanaWallet || !program) return;

      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
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
          caller: loggedUserWallet.publicKey,
          payer: loggedUserWallet.publicKey,
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
