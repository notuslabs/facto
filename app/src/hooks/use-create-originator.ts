"use client";

import { PublicKey } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTokenAccounts } from "./use-token-accounts";
import { FAKE_MINT } from "@/lib/constants";
import { useSession } from "./use-session";
import { useProgram } from "./use-program";
import { z } from "zod";
import { OriginatorFormSchema } from "@/app/[locale]/become/originator/_components/originator-form";

class CustomError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function useCreateOriginator() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const { data: programData } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const t = useTranslations("become.originator");

  const solanaWallet = data?.solanaWallet;
  const program = programData?.program;

  return useMutation({
    mutationFn: async ({ name, description, tokenSlug }: z.infer<typeof OriginatorFormSchema>) => {
      if (!solanaWallet || !program) {
        throw new CustomError(t("not-authenticated"));
      }

      if (!!tokenAccounts?.originatorTokenAccount) {
        throw new CustomError(t("already-registered-toast-message"));
      }

      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), loggedUserWallet.publicKey.toBuffer()],
        program.programId,
      );

      const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator_token_account"), originatorPubKey.toBuffer()],
        program.programId,
      );

      const res = await program.methods
        .createOriginator(name, description, tokenSlug)
        .accounts({
          originator: originatorPubKey,
          originatorTokenAccount: originatorTokenAccountPubKey,
          stableCoin: FAKE_MINT,
          payer: loggedUserWallet.publicKey,
          caller: loggedUserWallet.publicKey,
        })
        .signers([loggedUserWallet])
        .rpc();

      console.log({ res });
    },
    onSuccess: () => {
      toast.success(t("success-toast-message"));

      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: (error) => {
      console.error(error);

      if (error instanceof CustomError) {
        toast.error(error.message);
        return;
      }

      toast.error(t("error-toast-message"));
    },
  });
}
