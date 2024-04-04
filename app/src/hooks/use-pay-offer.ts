"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { FAKE_MINT } from "@/lib/constants";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { toast } from "sonner";

type PayOffer = {
  offerId: string;
};

export function usePayOffer(key: string) {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationKey: ["pay-offer", key],
    mutationFn: async ({ offerId }: PayOffer) => {
      if (!keypair || !program) return;

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator_token_account"), originatorPubKey.toBuffer()],
        program.programId,
      );

      const res = await program.methods
        .payInstallment(offerId)
        .accounts({
          stableToken: FAKE_MINT,
          originatorTokenAccount: originatorTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
        })
        .signers([keypair])
        .rpc();
    },
    onSuccess: () => {
      toast.success("Parcela paga com sucesso");

      queryClient.invalidateQueries({
        queryKey: ["offers-by-originator"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
