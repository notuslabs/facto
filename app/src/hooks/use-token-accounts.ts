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
    queryKey: ["token-accounts", address?.toString()],
    queryFn: async () => {
      if (!solanaWallet || !program) return;

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

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        loggedUserWallet,
        FAKE_MINT,
        loggedUserWallet.publicKey,
      ).catch((e) => console.log(e));

      const investorTokenAccount = await getAccount(connection, investorTokenAccountPubKey);

      return {
        investorTokenAccount,
        userTokenAccount,
      };
    },
    retry: 0,
    enabled: !!solanaWallet && !!program && !!address,
  });
}
