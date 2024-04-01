import { BN, IdlAccounts } from "@coral-xyz/anchor";
import { IDL } from "@/lib/idl/facto-idl-types";
import { getProgram } from "@/services/get-program";

type Account<T extends keyof IdlAccounts<typeof IDL>> = IdlAccounts<typeof IDL>[T];

export enum OfferStatus {
  Open = "Open",
}

export class Offer {
  private constructor(raw: Account<"offer">, rawOriginator: Account<"originator">) {
    this.id = raw.id;
    this.description = raw.description;
    this.discriminator = raw.discriminator;
    this.interestRatePercent = raw.interestRatePercent;
    this.goalAmount = raw.goalAmount;
    this.originator = rawOriginator;
    this.deadlineDate = new Date(raw.deadlineDate.toNumber());
    this.acquiredAmount = raw.acquiredAmount;
    this.installmentsTotal = raw.installmentsCount;
    (this.installmentsStartDate = new Date(raw.installmentsNextPaymentDate.toNumber())),
      (this.minAmountInvest = raw.minAmountInvest);
    this.startDate = raw.startDate ? new Date(raw.startDate.toNumber()) : undefined;
    this.creditScore = raw.creditScore;
    this.createdAt = new Date(raw.createdAt.toNumber());
  }

  public id: string;

  public get name(): string {
    return `${this.originator.tokenSlug}#${this.discriminator}`;
  }

  public description: string;
  public discriminator: number;
  public interestRatePercent: number;
  public goalAmount: BN;

  public get status(): OfferStatus {
    return OfferStatus.Open;
  }

  public deadlineDate: Date;
  public acquiredAmount: BN;
  public originator: Account<"originator">;
  public installmentsTotal: number;
  public installmentsStartDate?: Date;
  public minAmountInvest: BN;
  public startDate?: Date;
  public creditScore: number;
  public createdAt: Date;

  toJSON() {
    return {
      ...this,
      name: this.name,
      status: this.status,
    };
  }

  static async fromRawCollection(raw: { account: Account<"offer"> }[]) {
    const program = getProgram();

    const originatorsPubKeys = raw.map((raw) => raw.account.originator);
    const originators = (await program.account.originator.fetchMultiple(
      originatorsPubKeys,
    )) as Account<"originator">[];

    return raw
      .map((raw, index) => new Offer(raw.account, originators[index]))
      .sort((a, b) => b.discriminator - a.discriminator);
  }
}
