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

export default function InvestmentsDesktopTable({ data }: DesktopTableProps) {
  const t = useTranslations("investments-page");

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {data.map((tableData) => (
        <Table className="rounded-2xl bg-secondary p-4" key={tableData.offerName}>
          <>
            <TableHeader className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              <TableRow>
                <TableHead className="h-4 w-[1/9] pt-3">{t("offer-name")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("raised-value")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("offer-total")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("invested-amount")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("return")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("final-date")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("installment-number")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("visualize")}</TableHead>
                <TableHead className="h-4 w-[120px] pt-3 text-right">{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableRow>
                <TableCell className="pb-3 pt-2">{tableData.offerName}</TableCell>
                <TableCell className="pb-3 pt-2">{tableData.totalRaised}</TableCell>
                <TableCell className="pb-3 pt-2">{tableData.offerTotal}</TableCell>
                <TableCell className="pb-3 pt-2">{tableData.investedAmt}</TableCell>
                <TableCell className="pb-3 pt-2">
                  {tableData.returnPercentage} {t("per-year")}
                </TableCell>
                <TableCell className="pb-3 pt-2">{tableData.finalDate}</TableCell>
                <TableCell className="pb-3 pt-2">
                  {tableData.installments} {t("installments")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  <a
                    className="flex items-center gap-2 transition-opacity hover:opacity-50"
                    href={tableData.link}
                  >
                    <ExternalLink size={20} />
                    <span className="underline underline-offset-2">{t("see-offer")}</span>
                  </a>
                </TableCell>
                <TableCell className="w-[120px] pb-3 pt-2 text-right">
                  {tableData.paymentStatus}
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        </Table>
      ))}
    </div>
  );
}
