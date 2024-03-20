import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

type ScoreBadgeProps = {
  score: number;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const t = useTranslations("score-card");
  const scoreCodes = [
    { range: [0, 250], info: { code: "C", text: t("bad") } },
    { range: [250, 500], info: { code: "B", text: t("regular") } },
    { range: [500, 750], info: { code: "A", text: t("good") } },
    { range: [750, Infinity], info: { code: "AAA", text: t("excellent") } },
  ];

  const { code, text } = scoreCodes.find(({ range }) => score >= range[0] && score < range[1])
    ?.info || { code: "N/A", text: "Unknown" };

  let colorClass;

  switch (code) {
    case "C":
      colorClass = "bg-red-500 border-red-300";
      break;
    case "B":
      colorClass = "bg-yellow-500 border-yellow-300";
      break;
    case "A":
      colorClass = "bg-green-500 border-green-300";
      break;
    case "AAA":
      colorClass = "bg-blue-900 border-blue-600";
      break;
    default:
      colorClass = "bg-gray-500 border-gray-300";
  }

  return (
    <Badge
      variant="outline"
      className={`text-foreground ${colorClass} rounded-md hover:${colorClass}`}
    >
      {code}
    </Badge>
  );
}
