"use client";

import { PublicKey } from "@solana/web3.js";
import { useSession } from "@/components/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { utils } from "@coral-xyz/anchor";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { FAKE_MINT } from "@/app/[locale]/test-token-account-transfer/page";
import { useTokenAccounts } from "./use-token-accounts";

class AlreadyRegisteredError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function useCreateOriginator() {
  const queryClient = useQueryClient();
  const { solanaWallet } = useSession();
  const { program } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const t = useTranslations("become.originator");

  console.log("tokenAccounts", tokenAccounts);

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!solanaWallet || !program) return;

      if (!!tokenAccounts?.originatorTokenAccount) {
        throw new AlreadyRegisteredError(t("already-registered-toast-message"));
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

      await program.methods
        .createOriginator(name, description)
        .accounts({
          originator: originatorPubKey,
          originatorTokenAccount: originatorTokenAccountPubKey,
          stableCoin: FAKE_MINT,
          payer: loggedUserWallet.publicKey,
          caller: loggedUserWallet.publicKey,
        })
        .signers([loggedUserWallet])
        .rpc();

      console.log(
        "Originator created",
        originatorPubKey.toString(),
        originatorTokenAccountPubKey.toString(),
        name,
        description,
      );
    },
    onSuccess: () => {
      toast.success(t("success-toast-message"));

      queryClient.invalidateQueries({
        queryKey: ["token-accounts"],
      });
    },
    onError: (error) => {
      console.error(error);

      if (error instanceof AlreadyRegisteredError) {
        toast.error(error.message);
        return;
      }

      toast.error(t("error-toast-message"));
    },
  });
}
