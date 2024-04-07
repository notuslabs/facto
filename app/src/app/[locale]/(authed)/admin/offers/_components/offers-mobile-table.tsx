import { Badge, STATUSES_TO_VARIANTS } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useOfferInvestmentsClaim } from "@/hooks/use-offer-investments-claim";
import { Link } from "@/navigation";
import { Offer } from "@/structs/Offer";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDollarSign, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface DesktopTableProps {
  offers: Offer[];
}

export default function OffersMobileTable({ offers }: DesktopTableProps) {
  const t = useTranslations("admin-offers");
  const tb = useTranslations("offer-status");
  const formatCurrency = useFormatNumber();
  const formatDate = useDateFormatter();
  const { mutate: offerInvestmentsClaim } = useOfferInvestmentsClaim();
  const queryClient = useQueryClient();

  const handleOfferInvestmentsClaim = (event: React.MouseEvent, offerId: string) => {
    const id = toast.loading(t("claiming-investments"));

    offerInvestmentsClaim(offerId, {
      async onSuccess(data, variables, context) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["offers-by-borrower"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["balance"],
          }),
        ]);
        toast.success(t("investments-claimed"), {
          id,
          action: (() => (
            <a
              href={`https://explorer.solana.com/tx/${data?.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("view-transaction")}
            </a>
          ))(),
        });
      },
      onError(error, variables, context) {
        toast.error(error.message, { id });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {offers.map((offer) => {
        return (
          <div key={offer.id} className="flex flex-col items-center rounded-lg bg-secondary">
            <Table className="flex flex-col rounded-2xl bg-secondary" key={offer.name}>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("offer-name")}</TableHead>
                  <TableHead className="h-4 pt-3 text-right">{t("status")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{offer.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={STATUSES_TO_VARIANTS[offer.status]}>{tb(offer.status)}</Badge>
                  </TableCell>
                </TableBody>
              </TableRow>
              <TableRow className="flex flex-col gap-1 border-b border-border-hover">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("raised-value")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{formatCurrency({ value: offer.acquiredAmount })}</TableCell>
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
                </TableBody>
              </TableRow>
              <TableRow className="flex items-center justify-between border-b border-border-hover">
                <TableHeader className="text-xs text-placeholder-foreground">
                  <TableHead>{t("offer-total")}</TableHead>
                </TableHeader>
                <TableBody className="text-sm font-medium">
                  <TableCell>{formatCurrency({ value: offer.goalAmount })}</TableCell>
                </TableBody>
              </TableRow>
              <TableRow className="flex flex-col gap-1">
                <TableHeader className="flex justify-between text-xs text-placeholder-foreground">
                  <TableHead className="h-4 pt-3">{t("start-date")}</TableHead>
                  <TableHead className="h-4 pt-3 text-right">{t("installment-number")}</TableHead>
                </TableHeader>
                <TableBody className="flex justify-between text-sm font-medium">
                  <TableCell>{formatDate(offer.installmentsStartDate, "P")}</TableCell>
                  <TableCell className="text-right">
                    {offer.installmentsCount} {t("installments")}
                  </TableCell>
                </TableBody>
              </TableRow>
            </Table>
            <div className="w-full px-4 py-3">
              <Button
                className="w-full disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
                onClick={(event) => handleOfferInvestmentsClaim(event, offer.id)}
              >
                <CircleDollarSign size={16} />
                {t("claim-investments")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
