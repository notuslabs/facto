import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "@/lib/format-units";
import { useInvestorTokenAccount } from "./use-investor-token-account";

export function useBalance() {
  const { data, isPending } = useInvestorTokenAccount();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["balance", data?.investorTokenAccount?.amount.toString()],
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
