import { web3auth } from "@/lib/web3AuthService";
import { useQuery } from "@tanstack/react-query";
import { SolanaWallet } from "@web3auth/solana-provider";

export function useWeb3AuthStatus() {
  return useQuery({
    queryKey: ["web3-auth-status", web3auth.status],
    queryFn: async () => {
      return web3auth.status;
    },
  });
}

export function useSolanaWallet() {
  const { data: status } = useWeb3AuthStatus();

  return useQuery({
    queryKey: ["solana-wallet", web3auth.provider, status],
    queryFn: async () => {
      if (!web3auth.provider) return null;

      return new SolanaWallet(web3auth.provider);
    },
    enabled: !!web3auth.provider && !!status && status !== "connecting",
  });
}
