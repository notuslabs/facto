"use client";

import { GradientCoinsHand } from "@/components/illustrations/gradient-coins-hand";
import { ChoiceCard } from "./choice-card";
import { Link } from "@/navigation";
import { InvestorTexture } from "@/components/illustrations/investor-texture";
import { useTranslations } from "next-intl";

export function InvestorChoiceCard() {
  const t = useTranslations("opening-page.investor-card");

  return (
    <Link href="/offers">
      <ChoiceCard
        title={t("title")}
        titleClassName="bg-gradient-to-r from-[#A3DE10] to-[#E0FF92] inline-block text-transparent bg-clip-text"
        description={t("description")}
        icon={<GradientCoinsHand />}
        className="bg-[radial-gradient(at_top_left,_rgba(163,222,16,1)_30%,_rgba(224,255,146,0)_100%)] bg-left"
        contentClassName="bg-background rounded-2xl overflow-hidden"
      >
        <InvestorTexture className="absolute bottom-0 right-0" />
        <div className="absolute -bottom-[204px] -right-[204px] size-[408px] rounded-full bg-[radial-gradient(circle,_rgba(163,222,16,1)_0%,_rgba(224,255,146,0)_100%)] opacity-[4%] blur-xl"></div>
      </ChoiceCard>
    </Link>
  );
}
