"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionDialog from "@/components/transaction-dialog";

export function NavbarDepositButton() {
  const { data } = useSession();
  const t = useTranslations("navbar");

  if (!data?.userInfo) return null;

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
        <TransactionDialog type="deposit" />
      </DialogContent>
    </Dialog>
  );
}
