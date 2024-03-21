import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

const tableData = [
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="green">Pago</Badge>,
  },
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="yellow">Previsto</Badge>,
  },
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="red">Previsto</Badge>,
  },
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="secondary">Previsto</Badge>,
  },
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="secondary">Previsto</Badge>,
  },
  {
    data: "16/04/2024",
    offer: "Agiotagem #1",
    totalAmount: "R$250.00",
    paymentStatus: <Badge variant="secondary">Previsto</Badge>,
  },
];

export function AboutCard() {
  const t = useTranslations("offer-page.tabs.about-originator");
  return (
    <div className="rounded-2xl dark:bg-primary-foreground dark:text-primary">
      <div className="flex flex-col gap-4 px-8 py-6">
        <h2 className="pb-2 text-xl font-bold">{t("title")}</h2>
        <Separator className="dark:bg-secondary" />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md border dark:border-primary"></div>
              <div className="flex flex-col text-sm">
                <span className="font-bold">Agiotagem</span>
                <span className="text-xs text-muted-foreground">Tipo, Categoria ou nicho</span>
              </div>
            </div>
          </div>
          <p className="text-sm">
            Como Agiotagem, o mentor por trás deste projeto residencial ecológico, estou
            comprometido em promover uma mudança positiva na construção civil. Com vasta experiência
            e uma visão sustentável, cada contribuição é valorizada e investida com integridade e
            transparência. Juntos, estamos construindo mais do que simples casas; estamos criando um
            santuário para aqueles que valorizam o meio ambiente e a qualidade de vida. Agradeço
            imensamente por se juntar a nós nesta jornada rumo a um futuro mais sustentável e
            próspero para todos.
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Ofertas</span>
            <span className="text-2xl font-medium text-foreground">1</span>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="dark:bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Perda</span>
              <span>66.6%</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="dark:bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total captado</span>
              <span>$69.420,00</span>
            </div>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="text-sm dark:bg-primary-foreground">
          <TableRow>
            <TableHead className="w-1/4 text-foreground">Data</TableHead>
            <TableHead className="w-1/4 text-foreground">Nº Parcela</TableHead>
            <TableHead className="w-1/4 text-foreground">Valor</TableHead>
            <TableHead className="w-1/4 text-right text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((tableData) => (
            <TableRow className="border-b text-sm  dark:border-secondary" key={tableData.data}>
              <TableCell>{tableData.offer}</TableCell>
              <TableCell>{tableData.totalAmount}</TableCell>
              <TableCell>{tableData.data}</TableCell>
              <TableCell className="text-right">{tableData.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
