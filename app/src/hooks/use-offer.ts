import { getOffer } from "@/services/get-offer";
import { useQuery } from "@tanstack/react-query";

export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => getOffer(id),
    refetchInterval: 1000 * 20,
  });
}
