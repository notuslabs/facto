"use client";

import { PublicKey } from "@solana/web3.js";
import { useSession } from "@/components/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { utils } from "@coral-xyz/anchor";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTokenAccounts } from "./use-token-accounts";
import { FAKE_MINT } from "@/lib/constants";

class AlreadyRegisteredError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function useCreateInvestor() {
  const queryClient = useQueryClient();
  const { solanaWallet } = useSession();
  const { program } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const t = useTranslations("become.investor");

  return useMutation({
    mutationFn: async (name: string) => {
      if (!solanaWallet || !program) return;

      if (!!tokenAccounts?.investorTokenAccount) {
        throw new AlreadyRegisteredError(t("already-registered-toast-message"));
      }

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
        .createInvestor(name)
        .accounts({
          investor: investorPubKey,
          investorTokenAccount: investorTokenAccountPubKey,
          caller: loggedUserWallet.publicKey,
          payer: loggedUserWallet.publicKey,
          stableCoin: FAKE_MINT,
        })
        .signers([loggedUserWallet])
        .rpc();
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
