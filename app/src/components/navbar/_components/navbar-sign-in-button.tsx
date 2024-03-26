"use client";

import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarSignInButton() {
  const { userInfo, login, isLoading } = useSession();

  const t = useTranslations("navbar");

  if (userInfo) return;

  if (isLoading) {
    return <Loader2 size={16} className="animate-spin" />;
  }

  return <Button onClick={login}>{t("login")}</Button>;
}
