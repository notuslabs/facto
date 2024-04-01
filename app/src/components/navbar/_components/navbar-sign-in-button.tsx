"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarSignInButton() {
  const { data, isLoading } = useSession();
  const { login } = useAuth();

  const t = useTranslations("navbar");

  if (!!data?.userInfo) return null;

  if (isLoading) {
    return <Loader2 size={16} className="animate-spin" />;
  }

  return (
    <Button variant="ghost" onClick={() => login()}>
      {t("login")}
    </Button>
  );
}
