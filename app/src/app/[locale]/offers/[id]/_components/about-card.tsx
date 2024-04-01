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
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

type AboutCardProps = {
  name: string;
  description: string;
};

export function AboutCard({ name, description }: AboutCardProps) {
  const t = useTranslations("offer-page.about-originator");
  const tr = useTranslations("badges");

  const tableData = [
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
    },
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="yellow">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="red">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      data: "16/04/2024",
      offer: "Agiotagem #1",
      totalAmount: "R$250.00",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
  ];
  return (
    <div className="rounded-2xl bg-primary-foreground text-primary">
      <div className="flex flex-col gap-4 p-6 md:px-8 md:py-6">
        <h2 className="pb-2 text-xl font-bold">{t("title")}</h2>
        <Separator className="bg-secondary" />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md border border-primary">
                <User size={16} />
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-bold">{name}</span>
                {/* <span className="text-xs text-muted-foreground">Tipo, Categoria ou nicho</span> */}
              </div>
            </div>
          </div>
          <p className="text-sm">{description}</p>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t("offers")}</span>
            <span className="text-2xl font-medium text-foreground">1</span>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t("loss")}</span>
              <span>66.6%</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t("total-raised")}</span>
              <span>$69.420,00</span>
            </div>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-primary-foreground text-sm">
          <TableRow>
            <TableHead className="w-1/4 text-foreground">{t("date")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("installment-number")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("amount")}</TableHead>
            <TableHead className="w-1/4 text-right text-foreground">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((tableData) => (
            <TableRow className="border-b border-secondary text-sm" key={tableData.data}>
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
