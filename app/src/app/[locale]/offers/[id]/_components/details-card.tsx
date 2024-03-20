import { Separator } from "@/components/ui/separator";
import { CalendarDays, HandCoins } from "lucide-react";

export function DetailsCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-800 p-8">
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <HandCoins size={32} /> Rendimento esperado
        </div>
        <div>
          <span className="text-2xl font-bold">2,5%</span> ao ano
        </div>
      </div>
      <Separator className="bg-foreground" />
      <div className="flex justify-between pb-4">
        <div className="flex gap-2">
          <CalendarDays size={24} /> Prazo do empréstimo
        </div>
        <div className="font-semibold">6 meses</div>
      </div>
      <p className="text-pretty text-sm">
        Junte-se a nós na construção do Sonho Verde, um condomínio residencial ecologicamente
        sustentável, onde o conforto se une à preservação ambiental. Com sua contribuição através do
        nosso crowdfunding, podemos transformar esse projeto em realidade, oferecendo espaços
        verdes, tecnologias eco-friendly e qualidade de vida incomparável. Cada doação conta!
        Participe agora e faça parte dessa comunidade que valoriza o futuro do planeta e o bem-estar
        de todos os seus habitantes.
      </p>
    </div>
  );
}
