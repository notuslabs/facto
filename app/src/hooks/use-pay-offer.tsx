"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { FAKE_MINT } from "@/lib/constants";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { getAccount } from "@solana/spl-token";
import { getConnection } from "@/services/get-connection";
import { formatUnits } from "@/lib/format-units";

type PayOffer = {
  offerId: string;
  amount: number;
};

export function usePayOffer(key: string) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const connection = getConnection();

  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationKey: ["pay-offer", key],
    mutationFn: async ({ offerId, amount }: PayOffer) => {
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

      const borrowerTokenAccount = await getAccount(connection, borrowerTokenAccountPubKey);

      if (amount > formatUnits(borrowerTokenAccount.amount)) {
        throw new Error("Insuficient amount to pay installment");
      }

      const tx = await program.methods
        .payInstallment(offerId)
        .accounts({
          stableToken: FAKE_MINT,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
        })
        .signers([keypair])
        .rpc({ commitment: "finalized" });

      return { tx };
    },
    onSuccess: ({ tx }) => {
      queryClient.invalidateQueries({
        queryKey: ["investor-investments"],
      });

      toast.success(t("pay-offer.pay-successful"), {
        action: (() => (
          <a
            href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("pay-offer.view-transaction")}
          </a>
        ))(),
      });

      queryClient.invalidateQueries({
        queryKey: ["offers-by-borrower"],
      });

      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("pay-offer.pay-error", { error: error.message }));
    },
  });
}
