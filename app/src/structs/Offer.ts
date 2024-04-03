import { IdlAccounts } from "@coral-xyz/anchor";
import { IDL } from "@/lib/idl/facto-idl-types";
import { getProgram } from "@/services/get-program";
import { addMonths, subMonths } from "date-fns";
import { getOfferInterestRate } from "@/lib/utils";

type Account<T extends keyof IdlAccounts<typeof IDL>> = IdlAccounts<typeof IDL>[T];

export enum OfferStatus {
  StartingSoon = "StartingSoon",
  Open = "Open",
  Funded = "Funded",
  OnTrack = "OnTrack",
  Finished = "Finished",
  Delinquent = "Delinquent",
  Failed = "Failed",
}

// Remember to only use JSON serializable types bc of nextjs and react-query caching
export class Offer {
  private constructor(raw: Account<"offer">, rawOriginator: Account<"originator">) {
    this.id = raw.id;
    this.description = raw.description;
    this.discriminator = raw.discriminator;
    this.interestRatePercent = getOfferInterestRate(
      raw.goalAmount.toNumber(),
      raw.installmentsTotalAmount.toNumber(),
      raw.installmentsCount,
    );
    this.goalAmount = raw.goalAmount.toNumber();
    this.originator = rawOriginator;
    this.deadlineDate = new Date(raw.deadlineDate.toNumber() * 1000).toISOString();
    this.acquiredAmount = raw.acquiredAmount.toNumber();
    this.installmentsCount = raw.installmentsCount;
    this.installmentsTotalAmount = raw.installmentsTotalAmount.toNumber();
    this.installmentsNextPaymentDate = new Date(
      raw.installmentsNextPaymentDate.toNumber() * 1000,
    ).toISOString();
    this.minAmountInvest = raw.minAmountInvest.toNumber();
    this.startDate = new Date(raw.startDate.toNumber() * 1000).toISOString();
    this.creditScore = raw.creditScore;
    this.createdAt = new Date(raw.createdAt.toNumber() * 1000).toISOString();
    this.totalInstallmentsPaid = raw.totalInstallmentsPaid;
    this.installmentsStartDate = subMonths(
      this.installmentsNextPaymentDate,
      this.totalInstallmentsPaid,
    ).toISOString();
    this.installmentsEndDate = addMonths(
      this.installmentsStartDate,
      this.installmentsCount - 1,
    ).toISOString();
  }

  public id: string;

  public get name(): string {
    return `${this.originator.tokenSlug}#${this.discriminator}`;
  }

  public description: string;
  public discriminator: number;
  public interestRatePercent: string;
  public goalAmount: number;

  public get status(): OfferStatus {
    const currentTime = new Date().getTime();
    const deadlineTime = new Date(this.deadlineDate).getTime();
    const startTime = new Date(this.startDate).getTime();
    const installmentsNextPaymentDateTime = new Date(this.installmentsNextPaymentDate).getTime();

    if (currentTime < startTime) {
      return OfferStatus.StartingSoon;
    }

    if (currentTime < deadlineTime && this.acquiredAmount < this.goalAmount) {
      return OfferStatus.Open;
    }

    if (this.acquiredAmount == this.goalAmount) {
      if (currentTime < deadlineTime) {
        return OfferStatus.Funded;
      }

      if (this.totalInstallmentsPaid === this.installmentsCount) {
        return OfferStatus.Finished;
      }

      if (currentTime <= installmentsNextPaymentDateTime) {
        return OfferStatus.OnTrack;
      } else {
        return OfferStatus.Delinquent;
      }
    }

    return OfferStatus.Failed;
  }

  public deadlineDate: string;
  public acquiredAmount: number;
  public originator: Account<"originator">;
  public installmentsCount: number;
  public installmentsNextPaymentDate: string;
  public installmentsStartDate: string;
  public minAmountInvest: number;
  public startDate: string;
  public creditScore: number;
  public createdAt: string;
  public installmentsTotalAmount: number;
  public totalInstallmentsPaid: number;
  public installmentsEndDate: string;

  toJSON() {
    return {
      ...this,
      name: this.name,
      status: this.status,
    };
  }

  static async fromRawItem(raw: { account: Account<"offer"> }) {
    const program = getProgram();
    const originatorPubKey = raw.account.originator;
    const originator = await program.account.originator.fetch(originatorPubKey);

    const offer = new Offer(raw.account, originator);

    return offer;
  }

  static async fromRawCollection(raw: { account: Account<"offer"> }[]) {
    const program = getProgram();

    const originatorsPubKeys = raw.map((raw) => raw.account.originator);
    const originators = (await program.account.originator.fetchMultiple(
      originatorsPubKeys,
    )) as Account<"originator">[];

    return raw
      .map((raw, index) => new Offer(raw.account, originators[index]))
      .sort((a, b) => a.discriminator - b.discriminator);
  }
}
