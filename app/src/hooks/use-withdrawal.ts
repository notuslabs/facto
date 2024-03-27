"use client";
import { PublicKey } from "@solana/web3.js";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/auth-provider";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "@/hooks/use-program";
import { BN } from "bn.js";
import { FAKE_MINT } from "../app/[locale]/test-token-account-transfer/page";

export function useWithdrawal() {
  const queryClient = useQueryClient();
  const { solanaWallet } = useSession();
  const { program } = useProgram();

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
