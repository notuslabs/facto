"use client";

import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionModal from "@/components/transaction-modal";

export function NavbarDepositButton() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");

  if (!userInfo) return null;

  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <Button variant="secondary" className="hidden gap-2 rounded-md lg:flex">
          {t("deposit")}
          <PlusSquare size={20} className="text-facto-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0">
        <TransactionModal type="deposit" />
      </DialogContent>
    </Dialog>
  );
}
