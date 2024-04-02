import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "@/lib/format-units";
import { useInvestorTokenAccount } from "./use-investor-token-account";

export function useBalance() {
  const { data, isPending } = useInvestorTokenAccount();

  return useQuery({
    queryKey: ["balance", data?.investorTokenAccount],
    queryFn: () => {
      if (isPending || !data) {
        return null;
      }

      return {
        formattedBalance: data.investorTokenAccount
          ? formatUnits(data.investorTokenAccount.amount, 9)
          : null,
      };
    },
  });
}
