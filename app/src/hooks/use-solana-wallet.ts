import { debounce } from "@/lib/debounce";
import { web3auth } from "@/lib/web3AuthService";
import { useQuery } from "@tanstack/react-query";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useInitModal } from "./use-init-modal";

export function useSolanaWallet() {
  const { data: status } = useInitModal();

  return useQuery({
    queryKey: ["solana-wallet", status],
    queryFn: async () => {
      if (!web3auth.provider) return null;

      const getSolanaWallet = debounce(
        (provider: typeof web3auth.provider) => new SolanaWallet(provider),
        200,
      );

      const solanaWallet = await getSolanaWallet(web3auth.provider);

      if (solanaWallet instanceof Error) {
        return null;
      }

      return solanaWallet;
    },
  });
}
