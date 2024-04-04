import { web3auth } from "@/lib/web3AuthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateInvestor } from "./use-create-investor";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "@/navigation";
import { flushSync } from "react-dom";

export function useAuth() {
  const { mutate: createInvestor } = useCreateInvestor();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (props?: { asOriginator?: boolean }) => {
      const provider = await web3auth.connect();

      if (provider && props?.asOriginator) {
        await queryClient.resetQueries();
        router.push("/become/originator");

        return provider;
      }

      if (provider) {
        await queryClient.resetQueries();
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

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await web3auth.logout();

      queryClient.resetQueries();
    },
  });

  return {
    login,
    logout,
    isPending: isLoggingIn || isLoggingOut,
  };
}
