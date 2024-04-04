import { useQuery } from "@tanstack/react-query";
import { useAccounts } from "./use-accounts";

export function useGenerateNewOfferName() {
  const { data: accounts } = useAccounts();

  return useQuery({
    queryKey: ["generate-new-offer-name", accounts?.borrowerAccount],
    queryFn: async () => {
      const borrower = accounts?.borrowerAccount;
      if (!borrower) return null;

      return `${borrower.tokenSlug}#${borrower.totalOffers}`;
    },
  });
}
