"use client";

import { useSession } from "../auth-provider";
import { Button } from "../ui/button";

export function NavbarSignInButton() {
  const { userInfo, login, logout, isLoading } = useSession();

  if (isLoading) return null;

  if (userInfo) {
    return <Button onClick={logout}>Sair</Button>;
  }

  return <Button onClick={login}>Entrar</Button>;
}
