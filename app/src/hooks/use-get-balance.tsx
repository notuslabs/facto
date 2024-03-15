import { useSession } from "@/components/auth-provider";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CustomChainConfig } from "@web3auth/base";
import { useEffect, useState } from "react";

export function useBalance() {
  const [balance, setBalance] = useState<number>();
  const { userInfo, solanaWallet } = useSession();
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

    const connection = new Connection(connectionConfig.rpcTarget);

    const balance = await connection.getBalance(new PublicKey(accounts[0]));

    setBalance(balance != null ? balance / LAMPORTS_PER_SOL : 0);
    setIsLoading(false);

    return balance / LAMPORTS_PER_SOL;
  };

  useEffect(() => {
    getBalance();
    // Every time the userInfo changes, we need to get the balance again
  }, [userInfo]);

  return {
    balance,
    isLoading,
  };
}
