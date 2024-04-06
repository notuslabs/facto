import { useQuery } from "@tanstack/react-query";
import { web3auth } from "@/lib/web3AuthService";
import { useInitModal } from "./use-init-modal";

export function useSession() {
  const { data: status } = useInitModal();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["session", status],
    queryFn: async () => {
      const userInfo = await web3auth.getUserInfo();

      if (!userInfo) throw new Error("Not authenticated");

      return {
        userInfo,
      };
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
}
