"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarDepositButton() {
  const { data } = useSession();
  const t = useTranslations("navbar");

  if (!data?.userInfo) return null;

  return (
    <Button
      variant="secondary"
      className="hidden gap-2 rounded-md bg-secondary text-secondary-foreground transition-opacity hover:opacity-50 lg:flex"
    >
      {t("deposit")}
      <PlusSquare size={20} />
    </Button>
  );
}
