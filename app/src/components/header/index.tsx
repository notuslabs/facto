"use client";

import { CircleDollarSign } from "lucide-react";
import { ScoreBadge } from "../score-badge";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import { useGetScoreRanges } from "@/hooks/use-generate-score-ranges";
import { useFormatNumber } from "@/hooks/number-formatters";

type HeaderProps = {
  name: string;
  description: string;
  score: number;
  acquiredAmount: number;
};

export function Header({ name, description, score, acquiredAmount }: HeaderProps) {
  const formatNumber = useFormatNumber();
  const t = useTranslations("header");
  const scoreRange = useGetScoreRanges(score);

  return (
    <header className="flex flex-col gap-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-4xl font-medium">
          <span className="size-[30px] rounded-md bg-white"></span>
          {name}
        </h1>
        <p>{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scoreRange != null && <ScoreBadge scoreRange={scoreRange} />}
        <Badge className="flex gap-1" variant="gray">
          <CircleDollarSign size={14} />
          {t("money-raised", { moneyRaised: formatNumber({ value: acquiredAmount }) })}
        </Badge>
      </div>
    </header>
  );
}
