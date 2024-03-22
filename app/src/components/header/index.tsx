import { CircleDollarSign, HelpingHand } from "lucide-react";
import { ScoreBadge } from "../score-badge";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";

type HeaderProps = {
  title: string;
  description: string;
  score: number;
  id: string;
};

export function Header({ title, description, score, id }: HeaderProps) {
  const t = useTranslations("header");
  const moneyRaised = 666.69;
  const peopleNumber = 420;
  return (
    <header className="flex flex-col gap-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-4xl font-medium">
          <span className="size-[30px] rounded-md bg-white"></span>
          {title} #{id}
        </h1>
        <p>{description}</p>
      </div>

      <div className="flex gap-1">
        <ScoreBadge score={score} />
        <Badge className="flex gap-1" variant="gray">
          <HelpingHand size={14} />
          {t("people-invested", { peopleNumber })}
        </Badge>
        <Badge className="flex gap-1" variant="gray">
          <CircleDollarSign size={14} />
          R$ {t("money-raised", { moneyRaised })}
        </Badge>
      </div>
    </header>
  );
}
