import { useSession } from "@/components/auth-provider";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CustomChainConfig } from "@web3auth/base";
import { useEffect, useState } from "react";
import { useConnection } from "./use-connection";

export function useBalance() {
  const { userInfo, solanaWallet } = useSession();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const getBalance = async () => {
    if (!userInfo) {
      setBalance(undefined);
      setIsLoading(false);
      return;
    }
    if (!solanaWallet) {
      return;
    }

    const accounts = await solanaWallet.requestAccounts();

    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
      method: "solana_provider_config",
      params: [],
    });

    const balance = await connection.getBalance(new PublicKey(accounts[0]));

    setBalance(balance != null ? balance / LAMPORTS_PER_SOL : 0);
    setIsLoading(false);

    return balance / LAMPORTS_PER_SOL;
  };

  useEffect(() => {
    getBalance();
    // Every time the userInfo changes, we need to get the balance again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return {
    balance,
    isLoading,
  };
}
