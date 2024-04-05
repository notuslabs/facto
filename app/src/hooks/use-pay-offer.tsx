"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { FAKE_MINT } from "@/lib/constants";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";

type PayOffer = {
  offerId: string;
};

export function usePayOffer(key: string) {
  const queryClient = useQueryClient();
  const t = useTranslations("pay-offer");

  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationKey: ["pay-offer", key],
    mutationFn: async ({ offerId }: PayOffer) => {
      if (!keypair || !program) {
        throw new Error();
      }

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
        program.programId,
      );

      const tx = await program.methods
        .payInstallment(offerId)
        .accounts({
          stableToken: FAKE_MINT,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
        })
        .signers([keypair])
        .rpc();

      return { tx };
    },
    onSuccess: ({ tx }) => {
      toast.success(t("pay-successful"), {
        action: (() => (
          <a
            href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("view-transaction")}
          </a>
        ))(),
      });

      queryClient.invalidateQueries({
        queryKey: ["offers-by-borrower"],
      });
    },
    onError: (error) => {
      toast.error(t("pay-error", { error: error.message }));
    },
  });
}
