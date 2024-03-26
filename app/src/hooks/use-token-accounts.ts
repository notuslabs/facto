"use client";

import { useSession } from "@/components/auth-provider";
import { useProgram } from "@/hooks/use-program";
import { config } from "@/lib/web3AuthService";
import { utils } from "@coral-xyz/anchor";
import { getAccount, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { FAKE_MINT } from "../app/[locale]/test-token-account-transfer/page";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";

export function useTokenAccounts() {
  const { program } = useProgram();
  const { solanaWallet, address } = useSession();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["token-accounts", address?.toString(), program?.programId.toString()],
    queryFn: async () => {
      if (!solanaWallet || !program) return null;
      console.log("Here");

      const connection = new Connection(config.chainConfig.rpcTarget, "confirmed");
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

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), loggedUserWallet.publicKey.toBuffer()],
        program.programId,
      );

      const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator_token_account"), originatorPubKey.toBuffer()],
        program.programId,
      );

      console.log("originatorTokenAccountPubKey", originatorTokenAccountPubKey.toString());

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        loggedUserWallet,
        FAKE_MINT,
        loggedUserWallet.publicKey,
      ).catch((e) => console.log(e));
      console.log("userTokenAccount", userTokenAccount);

      const investorTokenAccount = await getAccount(connection, investorTokenAccountPubKey).catch(
        console.error,
      );
      console.log("investorTokenAccount", investorTokenAccount);

      const originatorTokenAccount = await getAccount(
        connection,
        originatorTokenAccountPubKey,
      ).catch(console.error);
      console.log("originatorTokenAccount", originatorTokenAccount);

      return {
        investorTokenAccount,
        originatorTokenAccount,
        userTokenAccount,
      };
    },
    retry: 0,
  });
}
