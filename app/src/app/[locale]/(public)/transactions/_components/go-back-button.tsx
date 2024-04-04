import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { ArrowLeft } from "lucide-react";

interface GoBackButtonProps {
  title: string;
}

export default function GoBackButton({ title }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <div className="h-11 bg-primary-foreground">
      <Button onClick={() => router.back()} className="flex gap-2" variant="ghost">
        <ArrowLeft size={16} />
        {title}
      </Button>
    </div>
  );
}
