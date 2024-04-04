import { useQuery } from "@tanstack/react-query";
import { web3auth } from "@/lib/web3AuthService";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useInitModal } from "./use-init-modal";

export function useSession() {
  const getPublicKey = useCallback(async (solanaWallet?: SolanaWallet | null) => {
    if (!solanaWallet) {
      return;
    }

    const pubKey = await solanaWallet.requestAccounts();

    return new PublicKey(pubKey[0]);
  }, []);

  const getUserInfo = useCallback(async () => {
    const user = await web3auth.getUserInfo();

    return user;
  }, []);

  useInitModal();

  return useQuery({
    queryKey: ["session", web3auth.provider?.chainId],
    queryFn: async () => {
      let userInfo = null;
      let solanaWallet = null;
      let address = null;

      // I don't know if this is the best way to this, but
      // I guess we don't need to instantiate the solana wallet
      // every time we want to execute an action, so I'm saving it
      // in a state variable.
      if (web3auth.provider) {
        solanaWallet = new SolanaWallet(web3auth.provider);

        address = (await getPublicKey(solanaWallet)) ?? null;
      }

      if (web3auth.connected) {
        userInfo = await getUserInfo();
      }

      return {
        userInfo,
        solanaWallet,
        address,
      };
    },
    enabled: !!web3auth.provider?.chainId,
    retry: 0,
  });
}
