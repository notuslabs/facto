import { RangeOption } from "@/structs/Offer";
import { Badge } from "../ui/badge";

type ScoreBadgeProps = {
  scoreRange: RangeOption;
};

export function ScoreBadge({ scoreRange }: ScoreBadgeProps) {
  return (
    <Badge
      variant={
        scoreRange.info.code.includes("A")
          ? "credit-score-a"
          : scoreRange.info.code.includes("B")
            ? "credit-score-b"
            : scoreRange.info.code.includes("C")
              ? "credit-score-c"
              : scoreRange.info.code.includes("D")
                ? "credit-score-d"
                : "outline"
      }
      className="h-6 rounded-md text-foreground"
    >
      {scoreRange.info.code}
    </Badge>
  );
}
