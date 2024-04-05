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

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
        program.programId,
      );

      const res = await program.methods
        .payInstallment(offerId)
        .accounts({
          stableToken: FAKE_MINT,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
        })
        .signers([keypair])
        .rpc()
        .catch(console.error);
      console.log(res);
    },
    onSuccess: () => {
      toast.success("Parcela paga com sucesso");

      queryClient.invalidateQueries({
        queryKey: ["offers-by-borrower"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
