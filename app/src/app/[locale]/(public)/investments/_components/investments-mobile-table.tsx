import { Badge, STATUSES_TO_VARIANTS } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatNumber } from "@/hooks/number-formatters";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Link } from "@/navigation";
import { Investment } from "@/structs/Investment";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface DesktopTableProps {
  investments: Investment[];
}

export default function InvestmentsMobileTable({ investments }: DesktopTableProps) {
  const t = useTranslations("investments-page");
  const tb = useTranslations("offer-status");
  const formatCurrency = useFormatNumber();
  const formatDate = useDateFormatter();

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {investments.map((investment, index) => (
        <Table
          className="flex flex-col rounded-2xl bg-secondary"
          key={`${investment.offer.name}-${index}-mobile`}
        >
          <TableRow className="flex flex-col gap-1 border-b border-border-hover">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("offer-name")}</TableHead>
              <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{investment.offer.name}</TableCell>
              <TableCell className="text-right">
                <Badge variant={STATUSES_TO_VARIANTS[investment.offer.status]}>
                  {tb(investment.offer.status)}
                </Badge>
              </TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex flex-col gap-1 border-b border-border-hover">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("invested-amount")}</TableHead>
              <TableHead className="h-4 pt-3">{t("visualize")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{formatCurrency({ value: investment.totalInvested })}</TableCell>
              <TableCell>
                <Link
                  className="flex items-center gap-2"
                  target="_blank"
                  href={{ params: { id: investment.offer.id }, pathname: "/offers/[id]" }}
                >
                  <ExternalLink size={20} />
                  <span className="underline underline-offset-2">{t("see-offer")}</span>
                </Link>
              </TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("offer-total")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{investment.offer.goalAmount}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("raised-value")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>{investment.offer.acquiredAmount}</TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex items-center justify-between border-b border-border-hover">
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableHead>{t("return")}</TableHead>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableCell>
                {investment.offer.interestRate}% {t("per-year")}
              </TableCell>
            </TableBody>
          </TableRow>
          <TableRow className="flex flex-col gap-1">
            <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
              <TableHead className="h-4 pt-3">{t("final-date")}</TableHead>
              <TableHead className="h-4 pt-3 text-right">{t("installment-number")}</TableHead>
            </TableHeader>
            <TableBody className="flex justify-between text-sm font-medium">
              <TableCell>{formatDate(investment.offer.deadlineDate, "P")}</TableCell>
              <TableCell className="text-right">
                {investment.offer.installmentsTotalAmount} {t("installments")}
              </TableCell>
            </TableBody>
          </TableRow>
        </Table>
      ))}
    </div>
  );
}
