"use client";

import { web3auth } from "@/lib/web3AuthService";
import { useQuery } from "@tanstack/react-query";

export function useInitModal() {
  return useQuery({
    queryKey: ["web3-auth"],
    queryFn: async () => {
      await web3auth.initModal();

      return web3auth.status;
    },
    staleTime: Infinity,
  });
}
