import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Link } from "@/navigation";
import { Investment } from "@/structs/Investment";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@/hooks/number-formatters";
import { Badge, STATUSES_TO_VARIANTS } from "@/components/ui/badge";

interface DesktopTableProps {
  investments: Investment[];
}

export default function InvestmentsDesktopTable({ investments }: DesktopTableProps) {
  const t = useTranslations("investments-page");
  const tb = useTranslations("offer-status");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {investments.map((investment) => (
        <Table className="rounded-2xl bg-secondary p-4" key={investment.offer.name}>
          <>
            <TableHeader className="text-xs text-placeholder-foreground">
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
                <TableCell className="pb-3 pt-2">{investment.offer.name}</TableCell>
                <TableCell className="pb-3 pt-2">{investment.offer.acquiredAmount}</TableCell>
                <TableCell className="pb-3 pt-2">{investment.offer.goalAmount}</TableCell>
                <TableCell className="pb-3 pt-2">
                  {formatCurrency({ value: investment.totalInvested })}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {investment.offer.interestRate}% {t("per-year")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {formatDate(investment.offer.deadlineDate, "P")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {investment.offer.installmentsCount} {t("installments")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  <Link
                    className="flex items-center gap-2"
                    target="_blank"
                    href={{ params: { id: investment.offer.id }, pathname: "/offers/[id]" }}
                  >
                    <ExternalLink size={20} />
                    <span className="underline underline-offset-2">{t("see-offer")}</span>
                  </Link>
                </TableCell>
                <TableCell className="w-[150px] pb-3 pt-2 text-right">
                  <Badge variant={STATUSES_TO_VARIANTS[investment.offer.status]}>
                    {tb(investment.offer.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        </Table>
      ))}
    </div>
  );
}
