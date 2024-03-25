import { Card } from "@/components/card";
import { HandCardMoney } from "@/components/illustrations/hand-card-money";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function FakeCard({ variant = "my-investments" }: { variant?: "my-investments" | "to-recieve" }) {
  return (
    <Card className="flex h-[544px] w-full items-center justify-center dark:bg-primary">
      <div className="flex flex-col items-center justify-center gap-4">
        <HandCardMoney />
        <div className="flex flex-col gap-1 text-center">
          <h2 className="font-medium text-gray-950">
            {variant === "my-investments" ? "Sem investimentos ainda" : "Nenhuma parcela a receber"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {variant === "my-investments"
              ? "Comece investindo em uma oferta clicando botão abaixo"
              : "Suas parcelas para pagamento, serão exibidas aqui"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function InvestmentsPageContent() {
  return (
    <div className="container -mt-[110px]">
      <Tabs defaultValue="my-investments" className="flex flex-col gap-6">
        <TabsList className="w-full gap-2">
          <TabsTrigger value="my-investments">Meus Investimentos</TabsTrigger>
          <TabsTrigger value="to-recieve">Parcelas a receber</TabsTrigger>
        </TabsList>

        <TabsContent value="my-investments">
          <FakeCard />
        </TabsContent>
        <TabsContent value="to-recieve">
          <FakeCard variant="to-recieve" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
