"use client";
import { PublicKey } from "@solana/web3.js";

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
  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationKey: ["create-investor-account"],
    mutationFn: async () => {
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
        .createInvestor(userInfo?.name ?? userInfo?.email ?? keypair.publicKey.toString())
        .accounts({
          investor: investorPubKey,
          investorTokenAccount: investorTokenAccountPubKey,
          payer: keypair.publicKey,
          caller: keypair.publicKey,
          stableCoin: FAKE_MINT,
        })
        .signers([keypair])
        .rpc()
        .catch((e) => console.log(e));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
}
