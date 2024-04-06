import { web3auth } from "@/lib/web3AuthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateInvestor } from "./use-create-investor";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "@/navigation";

export function useAuth() {
  const { mutate: createInvestor } = useCreateInvestor();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (props?: { asBorrower?: boolean }) => {
      const provider = await web3auth.connect();

      if (provider && props?.asBorrower) {
        await refetchAuthQueries();
        router.push("/become/borrower");

        return provider;
      }

      if (provider) {
        await refetchAuthQueries();
        const solanaWallet = new SolanaWallet(provider);
        const userInfo = await web3auth.getUserInfo();

        if (!userInfo?.name) {
          const accounts = await solanaWallet.requestAccounts();
          const publicKey = new PublicKey(accounts[0]);

          createInvestor(publicKey.toString());
        } else {
          // One of them surely exists here

          let name = userInfo!.name!;

          if (name.length > 30) {
            // try to use first name
            name = name.split(" ")[0];

            // try to use first 30 chars of first name
            if (name.length > 30) {
              name = name.slice(0, 30);
            }
          }

          createInvestor(userInfo?.name!);
        }
      }

      return provider;
    },
  });

  async function refetchAuthQueries() {
    await Promise.all([
      queryClient.resetQueries({
        queryKey: ["solana-wallet"],
      }),
      queryClient.resetQueries({
        queryKey: ["program"],
      }),
      queryClient.resetQueries({
        queryKey: ["session"],
      }),
      queryClient.resetQueries({
        queryKey: ["accounts"],
      }),
      queryClient.resetQueries({
        queryKey: ["token-accounts"],
      }),
    ]);

    await Promise.all([
      queryClient.refetchQueries({
        queryKey: ["solana-wallet"],
      }),
      queryClient.refetchQueries({
        queryKey: ["program"],
      }),
      queryClient.refetchQueries({
        queryKey: ["session"],
      }),
      queryClient.refetchQueries({
        queryKey: ["accounts"],
      }),
      queryClient.refetchQueries({
        queryKey: ["token-accounts"],
      }),
    ]);
  }

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await web3auth.logout();
      refetchAuthQueries();
      router.push("/");
    },
  });

  return {
    login,
    logout,
    isPending: isLoggingIn || isLoggingOut,
  };
}
