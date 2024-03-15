import { formatNumber } from "@/lib/format-number";
import { Button } from "./ui/button";
import { HelpingHand } from "lucide-react";

type OfferCardHeaderProps = {
  offerName: string;
  originatorName: string;
  period: string;
  percent: number;
};

function OfferCardHeader({ offerName, originatorName, percent, period }: OfferCardHeaderProps) {
  return (
    <div className="bg-primary px-4 py-3">
      <div className="flex items-center justify-between gap-2 text-background">
        <h3 className="text-lg font-semibold">{offerName}</h3>
        <span className="text-lg font-bold">{percent}%</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-background">
        <p className="text-xs">{originatorName}</p>
        <span className="text-xs">{period}</span>
      </div>
    </div>
  );
}

type OfferCardBodyProps = {
  amountAcquired: number;
  amountToBeAcquired: number;
};

function OfferCardBody({ amountAcquired, amountToBeAcquired }: OfferCardBodyProps) {
  return (
    <div className="flex w-full flex-col text-background">
      <div className="flex w-full flex-col gap-2 bg-white p-4">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Progresso</p>
            <p className="text-xs font-semibold">Total a ser captado</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm">{formatNumber(amountAcquired)}</p>
            <p className="text-sm">{formatNumber(amountToBeAcquired)}</p>
          </div>
        </div>

        <div className="h-2.5 w-full rounded-full bg-primary">
          <div className="h-2.5 w-1/3 rounded-full bg-accent" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-4 py-3.5">
        <p className="text-sm">Pontuação de crédito</p>
      </div>
    </div>
  );
}

type OfferCardFooterProps = {
  installments: number;
  endDate: Date;
};

function OfferCardFooter({ installments, endDate }: OfferCardFooterProps) {
  return (
    <div className="flex items-center justify-between gap-2 bg-primary px-4 py-[1.125rem]">
      <p className="text-xs text-muted-foreground">
        Receba em {installments} parcelas
        <span className="block font-semibold text-background">
          até {endDate.toLocaleDateString()}
        </span>
      </p>

      <Button variant="secondary" className="gap-2">
        Investir
        <HelpingHand size={16} />
      </Button>
    </div>
  );
}

export function OfferCard() {
  return (
    <div className="rounded-lg shadow-md">
      <OfferCardHeader
        offerName="Nome da Oferta"
        originatorName="NomeDoOriginador"
        percent={2.5}
        period="ao Ano"
      />
      <OfferCardBody amountAcquired={15895.15} amountToBeAcquired={146452} />
      <OfferCardFooter
        installments={22}
        endDate={new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)}
      />
    </div>
  );
}
