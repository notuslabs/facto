import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InvestmentsPage() {
  const t = useTranslations("investments-page");
  const tr = useTranslations("badges");

  const tableData = [
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="green">{tr("paid")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
    {
      offerName: "Agiotagem #1",
      totalRaised: "R$ 69.420",
      offerTotal: "R$ 420.690",
      investedAmt: "R$ 420",
      returnPercentage: "2.5%",
      finalDate: "16/04/2024",
      installments: 12,
      link: "www.google.com",
      paymentStatus: <Badge variant="secondary">{tr("anticipated")}</Badge>,
    },
  ];

  return (
    <div className="container flex flex-col gap-8 rounded-2xl p-10 dark:bg-primary-foreground dark:text-primary">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">{t("title")}</h2>
        <div className="flex gap-4">
          <div className="flex border-spacing-4 flex-col gap-1 border-r pr-4 text-right">
            <span className="text-xs text-muted-foreground dark:text-placeholder-foreground">
              {t("exhibiting")}
            </span>
            <span className="text-sm font-medium">6 {t("offers")}</span>
          </div>

          <Button variant="secondary" className="flex items-center">
            {t("all-status")} <ChevronDown size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tableData.map((tableData) => (
          <Table className="rounded-lg bg-secondary p-4" key={tableData.offerName}>
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
                  <TableCell className="pb-3 pt-2">{tableData.returnPercentage} per year</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.finalDate}</TableCell>
                  <TableCell className="pb-3 pt-2">{tableData.installments} installments</TableCell>
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
    </div>
  );
}
