import { ScoreBadge } from "../score-badge";
import { Badge } from "../ui/badge";

type HeaderProps = {
  title: string;
  description: string;
  score: number;
  id: string;
};

export function Header({ title, description, score, id }: HeaderProps) {
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
        <Badge variant="secondary" className="text-muted-foreground">
          $15.895,15 - captados
        </Badge>
      </div>
    </header>
  );
}
