"use client";

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
import { CircleDollarSign, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@/hooks/number-formatters";
import { Badge, STATUSES_TO_VARIANTS } from "@/components/ui/badge";
import { Offer } from "@/structs/Offer";
import { Button, buttonVariants } from "@/components/ui/button";
import { useOfferInvestmentsClaim } from "@/hooks/use-offer-investments-claim";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PublicKey, Connection } from "@solana/web3.js";
import { useProgram } from "@/hooks/use-program";
import { Account, getAccount } from "@solana/spl-token";
import { useEffect, useState } from "react";

interface DesktopTableProps {
  offers: Offer[];
}

export default function OffersDesktopTable({ offers }: DesktopTableProps) {
  const t = useTranslations("admin-offers");
  const tb = useTranslations("offer-status");
  const formatDate = useDateFormatter();
  const formatCurrency = useFormatNumber();
  const { mutate: offerInvestmentsClaim } = useOfferInvestmentsClaim();
  const queryClient = useQueryClient();
  const { data } = useProgram();
  const [balance, setBalance] = useState<(Account | null)[]>();

  useEffect(() => {
    async function main() {
      if (!data) return;

      const vaults = offers.map(async (offer) => {
        const [offerPubKey] = PublicKey.findProgramAddressSync(
          [Buffer.from("offer"), Buffer.from(offer.id)],
          data.program.programId,
        );
        const [vault] = PublicKey.findProgramAddressSync(
          [Buffer.from("offer_vault"), offerPubKey.toBuffer()],
          data.program.programId,
        );

        return getAccount(data?.program.provider.connection, vault).catch(() => null);
      });

      const balances = await Promise.all(vaults);
      setBalance(balances);
    }

    main();
  }, [data]);

  if (!data) return null;

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

  if (!balance) return null;

  return (
    <div className="hidden flex-col gap-4 md:flex">
      {offers.map((offer, index) => {
        const isClaimable = (balance[index]?.amount ?? 0n) > 0n ? true : false;

        return (
          <div key={offer.id} className="flex items-center rounded-lg bg-secondary">
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
                    <TableHead className="h-4 w-[1/9] pt-3">{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm font-medium">
                  <TableRow>
                    <TableCell className="pb-3 pt-2">{offer.name}</TableCell>
                    <TableCell className="pb-3 pt-2">
                      {formatCurrency({ value: offer.goalAmount })}
                    </TableCell>
                    <TableCell className="pb-3 pt-2">
                      {formatCurrency({ value: offer.acquiredAmount })}
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
                    <TableCell className="pb-3 pt-2">
                      <div className="w-[100px]">
                        <Badge variant={STATUSES_TO_VARIANTS[offer.status]}>
                          {tb(offer.status)}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </>
            </Table>
            <div className="px-4">
              <Button
                disabled={!isClaimable}
                className="disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground"
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
