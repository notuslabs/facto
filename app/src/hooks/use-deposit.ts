"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "./use-program";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async ({
      amount,
      variant,
    }: {
      amount: number;
      variant: "investor" | "borrower";
    }) => {
      if (!keypair || !program) return null;

      let tokenAccount: PublicKey;

      if (variant === "investor") {
        const [investorPubKey] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
          program.programId,
        );

        [tokenAccount] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("investor_stable_token_account"), investorPubKey.toBuffer()],
          program.programId,
        );
      } else {
        const [borrowerPubKey] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
          program.programId,
        );

        [tokenAccount] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
          program.programId,
        );
      }

      const { tx } = await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({ address: tokenAccount, amount }),
      }).then((res) => res.json());

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
  });
}
