import { useQuery } from "@tanstack/react-query";
import { web3auth } from "@/lib/web3AuthService";
import { useCallback } from "react";
import { useInitModal } from "./use-init-modal";
import { useSolanaWallet } from "./use-solana-wallet";
import { debounce } from "@/lib/debounce";
import { ADAPTER_STATUS_TYPE } from "@web3auth/base";

export function useSession() {
  const { data: solanaWallet } = useSolanaWallet();

  const retrieveUserSession = debounce(async (status: ADAPTER_STATUS_TYPE) => {
    let userInfo = null;

    if (status === "connected") {
      userInfo = await getUserInfo();
    }

    if (!userInfo) throw new Error("Not authenticated");

    return {
      userInfo,
      solanaWallet,
    };
  }, 200);

  const getUserInfo = useCallback(async () => {
    const user = await web3auth.getUserInfo();

    return user;
  }, []);

  useInitModal();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["session", !!solanaWallet, web3auth.status],
    queryFn: async () => {
      if (!web3auth.status) return null;

      const userSession = await retrieveUserSession(web3auth.status);

      if (userSession instanceof Error) {
        throw new Error("Not authenticated");
      }

      return userSession;
    },
    enabled: !!solanaWallet && !!web3auth.status,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
}
