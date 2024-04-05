"use client";

import { config } from "@/lib/web3AuthService";
import { utils } from "@coral-xyz/anchor";
import { Account, getAccount, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { FAKE_MINT } from "@/lib/constants";
import { useProgram } from "./use-program";

export function useTokenAccounts() {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["token-accounts", keypair?.publicKey?.toString(), program?.programId.toString()],
    queryFn: async () => {
      if (!keypair || !program) return null;

      const connection = new Connection(config.chainConfig.rpcTarget, "confirmed");

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_stable_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
        program.programId,
      );

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        FAKE_MINT,
        keypair.publicKey,
      );

      let investorTokenAccount = await getAccount(connection, investorTokenAccountPubKey).catch(
        () => null,
      );

      let borrowerTokenAccount = await getAccount(connection, borrowerTokenAccountPubKey).catch(
        () => null,
      );

      return {
        investorTokenAccount,
        borrowerTokenAccount,
        userTokenAccount,
      };
    },
    retry: 0,
  });
}
