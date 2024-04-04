import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatNumber, useFormatPercent } from "@/hooks/number-formatters";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Offer, OfferStatus } from "@/structs/Offer";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

type AboutCardProps = {
  offerId: string;
  name: string;
  description: string;
  allOffers: Offer[];
};

export function AboutCard({ offerId, name, description, allOffers }: AboutCardProps) {
  const formatNumber = useFormatNumber();
  const formatPercent = useFormatPercent();
  const format = useDateFormatter();
  const t = useTranslations("offer-page.about-borrower");

  const otherOffers = allOffers.filter((offer) => offer.id !== offerId);

  const totalAcquired = allOffers.reduce(
    (acc, offer) => (acc + offer.status === OfferStatus.Funded ? offer.goalAmount : 0),
    0,
  );

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
              </div>
            </div>
          </div>
          <p className="text-sm">{description}</p>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t("offers")}</span>
            <span className="text-2xl font-medium text-foreground">{allOffers.length}</span>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t("loss")}</span>
              <span>{formatPercent({ value: 0.0 })}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Separator orientation="vertical" className="bg-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t("total-raised")}</span>
              <span>{formatNumber({ value: totalAcquired })}</span>
            </div>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-primary-foreground text-sm">
          <TableRow>
            <TableHead className="w-1/4 text-foreground">{t("offer")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("amount")}</TableHead>
            <TableHead className="w-1/4 text-foreground">{t("date")}</TableHead>
            <TableHead className="w-1/4 text-right text-foreground">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {otherOffers.map((offer) => (
            <TableRow className="border-b border-secondary text-sm" key={offer.id}>
              <TableCell>{offer.name}</TableCell>
              <TableCell>{formatNumber({ value: offer.goalAmount })}</TableCell>
              <TableCell>{format(offer.installmentsEndDate, "P")}</TableCell>
              <TableCell className="text-right">{offer.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
