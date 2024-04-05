"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useOffersByBorrower } from "@/hooks/use-offers-by-borrower";
import { ChevronDown, PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import OffersDesktopTable from "./_components/offers-desktop-table";
import OffersMobileTable from "./_components/offers-mobile-table";
import { Link } from "@/navigation";

export default function OffersPage() {
  const { data: offers } = useOffersByBorrower();

  const t = useTranslations("admin-offers");

  if (!offers) return null;

  const totalOffers = offers.length;

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-4 text-primary md:bg-primary-foreground md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-medium md:text-2xl">{t("title")}</h2>
          <div className="flex border-spacing-4 gap-1 text-xs text-placeholder-foreground md:hidden">
            <span>{t("exhibiting")}</span>
            <span>{t("offers", { offerNumber: totalOffers })}</span>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="hidden border-spacing-4 flex-col gap-1 border-r pr-4 text-right md:flex">
            <span className="text-xs text-placeholder-foreground">{t("exhibiting")}</span>
            <span className="text-sm font-medium">{t("offers", { offerNumber: totalOffers })}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
          <Link href="/offers/create" className={buttonVariants()}>
            <PlusSquare size={20} />
            {t("create-offer")}
          </Link>
        </div>
      </div>

      <OffersMobileTable offers={offers} />
      <OffersDesktopTable offers={offers} />
    </div>
  );
}
