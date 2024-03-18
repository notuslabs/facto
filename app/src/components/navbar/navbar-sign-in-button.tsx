"use client";

import { Loader2, LogOut } from "lucide-react";
import { useSession } from "../auth-provider";
import { Button } from "../ui/button";

export function NavbarSignInButton() {
  const { userInfo, login, logout, isLoading } = useSession();

  if (userInfo) {
    return (
      <Button
        variant="destructive"
        onClick={logout}
        className="dark:bg-red-300 dark:text-primary-foreground dark:hover:bg-red-400"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
        Sair
      </Button>
    );
  }

  return (
    <Button onClick={login} disabled={isLoading || userInfo}>
      {isLoading && !userInfo ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
    </Button>
  );
}
