import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useConnection } from "./use-connection";
import { useSession } from "./use-session";

export function useBalance() {
  const { data } = useSession();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = data?.userInfo;
  const solanaWallet = data?.solanaWallet;

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
