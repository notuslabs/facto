import { IDL } from "@/lib/idl/facto-idl-types";
import { IdlAccounts } from "@coral-xyz/anchor";
import { Offer, RawOfferAccount } from "./Offer";
import { getProgram } from "@/services/get-program";
import { formatUnits } from "@/lib/format-units";
type Account<T extends keyof IdlAccounts<typeof IDL>> = IdlAccounts<typeof IDL>[T];
export type RawInvestmentAccount = Account<"investment">;

export class Investment {
  private constructor(raw: Account<"investment">, offer: Offer) {
    this.offer = offer;
    this.investor = raw.investor.toString();
    this.totalInvested = formatUnits(raw.totalInvested);
    this.installmentsReceived = raw.installmentsReceived;
  }

  public offer: Offer;
  public investor: string;
  public totalInvested: number;
  public installmentsReceived: number | null;

  static async fromRawCollection(raw: { account: Account<"investment"> }[]): Promise<Investment[]> {
    const program = getProgram();

    const rawOffers = (await program.account.offer.fetchMultiple(
      raw.map((i) => i.account.offer),
    )) as RawOfferAccount[];
    const offers = await Offer.fromRawCollection(
      rawOffers.map((account, index) => ({
        account,
        installmentsReceived: raw[index].account.installmentsReceived,
      })),
    );

    return raw.map((rawInvestment, index) => new Investment(rawInvestment.account, offers[index]));
  }
}
