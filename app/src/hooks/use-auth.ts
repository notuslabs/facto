import { web3auth } from "@/lib/web3AuthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async () => {
      const provider = await web3auth.connect();
      console.log(provider);
      console.log("Logging in");
      queryClient.refetchQueries({
        queryKey: ["session"],
      });
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await web3auth.logout();

      queryClient.refetchQueries({
        queryKey: ["session"],
      });
    },
  });

  return {
    login,
    logout,
    isPending: isLoggingIn || isLoggingOut,
  };
}
