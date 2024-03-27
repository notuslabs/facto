"use client";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useSession } from "@/components/auth-provider";
import { useProgram } from "@/hooks/use-program";
import { utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "../app/[locale]/test-token-account-transfer/page";
import { BN } from "bn.js";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { solanaWallet } = useSession();
  const { program } = useProgram();

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
        [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .depositTokens(new BN(amount * 10 ** 9))
        .accounts({
          investor: investorPubKey,
          investorTokenAccount: investorTokenAccountPubKey,
          owner: loggedUserWallet.publicKey,
          payer: loggedUserWallet.publicKey,
          mint: FAKE_MINT,
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
