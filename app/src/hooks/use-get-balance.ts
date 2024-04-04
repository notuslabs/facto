import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "@/lib/format-units";
import { BN } from "bn.js";
import { useTokenAccounts } from "./use-token-accounts";

type GetBalanceProps = {
  variant?: "investor" | "borrower" | "none";
};

export function useBalance({ variant }: GetBalanceProps) {
  const { data, isPending } = useTokenAccounts();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "balance",
      data?.investorTokenAccount?.amount.toString(),
      data?.borrowerTokenAccount?.amount.toString(),
      variant,
    ],
    enabled: !isPending && !!data,
    queryFn: () => {
      if (isPending || !data) {
        return null;
      }

      const formattedBalance =
        variant === "investor"
          ? formatUnits(data.investorTokenAccount?.amount ?? new BN(0))
          : formatUnits(data.borrowerTokenAccount?.amount ?? new BN(0));

      return {
        formattedBalance,
      };
    },
  });
}
