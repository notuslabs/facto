"use client";

import { PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { utils } from "@coral-xyz/anchor";
import { useTranslations } from "next-intl";
import { useTokenAccounts } from "./use-token-accounts";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";

class AlreadyRegisteredError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function useCreateInvestor() {
  const { data: programData } = useProgram();
  const { data: tokenAccounts } = useTokenAccounts();
  const t = useTranslations("become.investor");

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async (name: string) => {
      if (!keypair || !program) return;

      if (!!tokenAccounts?.investorTokenAccount) {
        throw new AlreadyRegisteredError(t("already-registered-toast-message"));
      }

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_stable_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .createInvestor(name)
        .accounts({
          investor: investorPubKey,
          investorStableTokenAccount: investorTokenAccountPubKey,
          caller: keypair.publicKey,
          payer: keypair.publicKey,
          stableCoin: FAKE_MINT,
        })
        .signers([keypair])
        .rpc();
    },
  });
}
