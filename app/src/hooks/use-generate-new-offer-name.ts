import { useQuery } from "@tanstack/react-query";
import { useAccounts } from "./use-accounts";

export function useGenerateNewOfferName() {
  const { data: accounts } = useAccounts();

  return useQuery({
    queryKey: ["generate-new-offer-name", accounts?.originatorAccount],
    queryFn: async () => {
      const originator = accounts?.originatorAccount;
      if (!originator) return null;

      return `${originator.tokenSlug}#${originator.totalOffers}`;
    },
  });
}
