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
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@/hooks/number-formatters";
import { Badge, STATUSES_TO_VARIANTS } from "@/components/ui/badge";
import { Offer } from "@/structs/Offer";

interface DesktopTableProps {
  offers: Offer[];
}

export default function OffersDesktopTable({ offers }: DesktopTableProps) {
  const t = useTranslations("admin-offers");
  const tb = useTranslations("offer-status");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {offers.map((offer) => (
        <Table className="rounded-2xl bg-secondary p-4" key={offer.name}>
          <>
            <TableHeader className="text-xs text-placeholder-foreground">
              <TableRow>
                <TableHead className="h-4 w-[1/9] pt-3">{t("offer-name")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("offer-total")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("raised-value")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("start-date")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("installment-number")}</TableHead>
                <TableHead className="h-4 w-[1/9] pt-3">{t("visualize")}</TableHead>
                <TableHead className="h-4 w-[120px] pt-3 text-right">{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm font-medium">
              <TableRow>
                <TableCell className="pb-3 pt-2">{offer.name}</TableCell>
                <TableCell className="pb-3 pt-2">
                  {formatCurrency({ value: offer.acquiredAmount })}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {formatCurrency({ value: offer.goalAmount })}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {formatDate(offer.installmentsStartDate, "P")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  {offer.installmentsCount} {t("installments")}
                </TableCell>
                <TableCell className="pb-3 pt-2">
                  <Link
                    className="flex items-center gap-2"
                    target="_blank"
                    href={{ params: { id: offer.id }, pathname: "/offers/[id]" }}
                  >
                    <ExternalLink size={20} />
                    <span className="underline underline-offset-2">{t("see-offer")}</span>
                  </Link>
                </TableCell>
                <TableCell className="w-[150px] pb-3 pt-2 text-right">
                  <Badge variant={STATUSES_TO_VARIANTS[offer.status]}>{tb(offer.status)}</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        </Table>
      ))}
    </div>
  );
}
