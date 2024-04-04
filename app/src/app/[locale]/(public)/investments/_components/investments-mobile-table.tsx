import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

type TableData = {
  offerName: string;
  totalRaised: string;
  offerTotal: string;
  investedAmt: string;
  returnPercentage: string;
  finalDate: string;
  installments: number;
  link: string;
  paymentStatus: JSX.Element;
};

interface DesktopTableProps {
  data: TableData[];
}

export default function InvestmentsMobileTable({ data }: DesktopTableProps) {
  const t = useTranslations("investments-page");

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {data.map((tableData) => (
        <Table className="flex flex-col rounded-2xl bg-secondary" key={tableData.offerName}>
          <TableRow className="flex flex-col gap-1 border-b border-border-hover">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("offer-name")}</TableHead>
              <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{tableData.offerName}</TableCell>
              <TableCell className="text-right">{tableData.paymentStatus}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex flex-col gap-1 border-b border-border-hover">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("invested-amount")}</TableHead>
              <TableHead className="h-4 pt-3">{t("visualize")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{tableData.investedAmt}</TableCell>
              <TableCell>
                <a className="flex items-center gap-2" href={tableData.link}>
                  <ExternalLink size={20} />
                  <span className="underline underline-offset-2">{t("see-offer")}</span>
                </a>
              </TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("offer-total")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.offerTotal}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("raised-value")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{tableData.totalRaised}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("return")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>
                {tableData.returnPercentage} {t("per-year")}
              </TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex flex-col gap-1">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("final-date")}</TableHead>
              <TableHead className="h-4 pt-3 text-right">{t("installment-number")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{tableData.finalDate}</TableCell>
              <TableCell className="text-right">
                {tableData.installments} {t("installments")}
              </TableCell>
            </TableBody>
          </TableRow>
        </Table>
      ))}
    </div>
  );
}
