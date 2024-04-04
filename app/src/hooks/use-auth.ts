import { web3auth } from "@/lib/web3AuthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async () => {
      const provider = await web3auth.connect();

      console.log({
        provider,
      });

      queryClient.resetQueries();

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
