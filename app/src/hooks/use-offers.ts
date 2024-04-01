import { listOffers } from "@/services/list-offers";
import { useQuery } from "@tanstack/react-query";

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: listOffers,
  });
}
