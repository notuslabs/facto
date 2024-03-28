"use client";
import { PublicKey } from "@solana/web3.js";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { FAKE_MINT } from "@/lib/constants";
import { useSession } from "./use-session";
import { useProgram2 } from "./use-program";

export function useWithdrawal() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { data: programData } = useProgram2();

  const solanaWallet = data?.solanaWallet;
  const program = programData?.program;

  return useMutation({
    mutationFn: async ({
      amount,
      toTokenAccount,
    }: {
      amount: number;
      toTokenAccount: PublicKey;
    }) => {
      if (!solanaWallet || !program) return;

      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
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
          payer: loggedUserWallet.publicKey,
          caller: loggedUserWallet.publicKey,
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
