"use client";

import { PublicKey } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTokenAccounts } from "./use-token-accounts";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";
import { z } from "zod";
import { BorrowerFormSchema } from "@/app/[locale]/(authed)/become/borrower/_components/borrower-form";
import { useRouter } from "@/navigation";

class CustomError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function useCreateBorrower() {
  const queryClient = useQueryClient();
  const { data: programData } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const t = useTranslations("become.borrower");
  const router = useRouter();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async ({ name, description, tokenSlug }: z.infer<typeof BorrowerFormSchema>) => {
      if (!keypair || !program) {
        throw new CustomError(t("not-authenticated"));
      }

      if (!!tokenAccounts?.borrowerTokenAccount) {
        throw new CustomError(t("already-registered-toast-message"));
      }

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
        program.programId,
      );

      await fetch("/api/airdrop", {
        method: "POST",
        body: JSON.stringify({ address: keypair.publicKey.toString() }),
      });

      await program.methods
        .createBorrower(name, description, tokenSlug)
        .accounts({
          borrower: borrowerPubKey,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          stableCoin: FAKE_MINT,
          payer: keypair.publicKey,
          caller: keypair.publicKey,
        })
        .signers([keypair])
        .rpc();
    },
    onSuccess: async () => {
      toast.success(t("success-toast-message"));
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["token-accounts"],
        }),
        queryClient.refetchQueries({
          queryKey: ["accounts"],
        }),
      ]);

      router.push("/admin/offers");
    },
    onError: (error) => {
      console.error(error);

      // if (error instanceof CustomError) {
      //   toast.error(error.message);
      //   return;
      // }

      toast.error(error.message);

      // toast.error(t("error-toast-message"));
    },
  });
}
