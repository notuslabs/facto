"use client";

import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useBalance } from "@/hooks/use-get-balance";

export default function Home() {
  const { login, logout, isLoading, userInfo } = useSession();
  const { balance, isLoading: isLoadingBalance } = useBalance();

  return (
    <main className="container flex min-h-screen w-full flex-col items-center justify-between p-24">
      <pre className="max-w-96 overflow-auto">{JSON.stringify(userInfo, null, 2)}</pre>
      {isLoading && <div>Loading...</div>}
      <span>
        {isLoadingBalance
          ? "Loading balance..."
          : balance != null
            ? `Balance: ${balance} SOL`
            : "Not connected"}
      </span>
      <div className="flex w-full flex-col gap-2">
        <Button onClick={login}>Login</Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </main>
  );
}
