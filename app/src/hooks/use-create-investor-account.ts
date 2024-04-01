"use client";
import { PublicKey } from "@solana/web3.js";

import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { useSession } from "./use-session";
import { useProgram } from "./use-program";

export function useCreateInvestorAccount() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { data: programData } = useProgram();

  const userInfo = data?.userInfo;
  const solanaWallet = data?.solanaWallet;
  const program = programData?.program;

  return useMutation({
    mutationKey: ["create-investor-account"],
    mutationFn: async () => {
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
        .createInvestor(userInfo?.name ?? userInfo?.email ?? loggedUserWallet.publicKey.toString())
        .accounts({
          investor: investorPubKey,
          investorTokenAccount: investorTokenAccountPubKey,
          payer: loggedUserWallet.publicKey,
          caller: loggedUserWallet.publicKey,
          stableCoin: FAKE_MINT,
        })
        .signers([loggedUserWallet])
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
