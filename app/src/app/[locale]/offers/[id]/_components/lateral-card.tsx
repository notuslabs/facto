import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HelpingHand } from "lucide-react";

export function LateralCard() {
  return (
    <aside className="flex flex-col gap-6 rounded-lg dark:bg-secondary dark:text-primary">
      <div className="flex justify-between p-6">
        <div>
          <p className="text-placeholder text-2xl font-semibold text-muted">$0</p>
          <p className="text-xs text-gray-950">
            Seu saldo em conta é de <span className="font-bold">$69.420</span>
          </p>
        </div>
        <p>Button Aqui</p>
      </div>

      <div className="px-6">
        <Button size="lg" variant="secondary" className="w-full gap-2">
          Investir agora
          <HelpingHand size={16} />
        </Button>
      </div>

      <div className="rounded-bl-lg rounded-br-lg border dark:bg-primary-foreground">
        <div className="flex justify-between px-6 pb-2 pt-4">
          <div className="flex flex-col gap-3">
            <span className="font-medium">Valor captado</span>
            <span className="text-xl font-semibold">$666,69</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-right font-medium">Total</span>
            <span className="text-xl font-semibold">$69.420</span>
          </div>
        </div>

        <div className="px-6 pb-4">
          <Progress indicatorColor="bg-success-strong" value={33} />
        </div>

        <div className="flex justify-between border-b border-t px-6 py-[14px] text-sm">
          <p>Status do projeto</p>
          <Badge variant="secondary" className="rounded-md">
            Em captação
          </Badge>
        </div>

        <div className="flex justify-between border-b px-6 py-[14px] text-sm">
          <p>Frequência de pagamento</p>
          <span className="font-semibold">Mensal</span>
        </div>

        <div className="flex justify-between px-6 py-[14px] text-sm">
          <p>Receba em 6 parcelas até</p>
          <span className="font-semibold">16/09/2024</span>
        </div>
      </div>
    </aside>
  );
}
