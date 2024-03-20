"use client";

import { Loader2, LogOut } from "lucide-react";
import { useSession } from "../auth-provider";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function NavbarSignInButton() {
  const { userInfo, login, logout, isLoading } = useSession();

  const t = useTranslations("navbar");

  if (userInfo) {
    return (
      <Button
        variant="destructive"
        onClick={logout}
        className="dark:bg-red-300 dark:text-primary-foreground dark:hover:bg-red-400"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
        {t("logout")}
      </Button>
    );
  }

  if (isLoading) {
    return <Loader2 size={16} className="animate-spin" />;
  }

  return <Button onClick={login}>{t("login")}</Button>;
}
