"use client";

import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ArrowUpSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarWithdrawalButton() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");

  if (!userInfo) return null;

  return (
    <Button variant="secondary" className="flex gap-2 rounded-md">
      {t("withdrawal")}
      <ArrowUpSquare size={20} />
    </Button>
  );
}
