"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCreateInvestor } from "@/hooks/use-create-investor";
import { useTranslations } from "next-intl";

export function NavbarSignInButton() {
  const { login } = useAuth();

  const t = useTranslations("navbar");

  return (
    <Button variant="ghost" onClick={() => login({ asBorrower: false })}>
      {t("login")}
    </Button>
  );
}
