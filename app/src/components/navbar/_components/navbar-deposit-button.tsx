"use client";

import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarDepositButton() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");

  if (!userInfo) return null;

  return (
    <Button
      variant="secondary"
      className="flex gap-2 rounded-md bg-secondary text-secondary-foreground"
    >
      {t("deposit")}
      <PlusSquare size={20} />
    </Button>
  );
}
