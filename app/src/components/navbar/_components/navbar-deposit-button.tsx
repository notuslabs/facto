"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionDialog from "@/components/transaction-dialog";

type NavbarDepositProps = {
  variant: "investor" | "borrower";
};

export function NavbarDepositButton({ variant }: NavbarDepositProps) {
  const t = useTranslations("navbar");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="hidden gap-2 rounded-md lg:flex">
          {t("deposit")}
          <PlusSquare size={20} className="text-brand-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0">
        <TransactionDialog type="deposit" variant={variant} />
      </DialogContent>
    </Dialog>
  );
}
