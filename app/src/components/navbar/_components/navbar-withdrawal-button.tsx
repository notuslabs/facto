"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { ArrowUpSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavbarWithdrawalButton() {
  const { data } = useSession();
  const t = useTranslations("navbar");

  if (!data?.userInfo) return null;

  return (
    <Button variant="secondary" className="flex gap-2 rounded-md">
      {t("withdrawal")}
      <ArrowUpSquare size={20} />
    </Button>
  );
}
