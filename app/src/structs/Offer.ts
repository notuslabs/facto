import { IdlAccounts } from "@coral-xyz/anchor";
import { IDL } from "@/lib/idl/facto-idl-types";
import { getProgram } from "@/services/get-program";
import { addMonths, subMonths, addHours, subHours } from "date-fns";
import { formatUnits } from "@/lib/format-units";

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

export enum InstallmentStatus {
  Paid = "paid",
  Upcoming = "upcoming",
  Overdue = "overdue",
}

export type CreditScoreOption = (typeof creditScoreOptions)[number];

export type RangeOption = {
  range: [number, number];
  info: {
    code: CreditScoreOption;
  };
};

export const creditScoreOptions = [
  "AAA",
  "AA",
  "A",
  "BBB",
  "BB",
  "B",
  "CCC",
  "CC",
  "C",
  "D",
] as const;

export type InstallmentsList = Array<{
  date: Date;
  installmentNumber: number;
  amount: number;
  status: InstallmentStatus;
}>;

export const paymentFrequencyOptions = ["monthly"] as const;

// Remember to only use JSON serializable types bc of nextjs and react-query caching
export class Offer {
  private constructor(raw: Account<"offer">, rawOriginator: Account<"originator">) {
    this.id = raw.id;
    this.description = raw.description;
    this.discriminator = raw.discriminator;
    this.goalAmount = formatUnits(raw.goalAmount);
    this.originator = rawOriginator;
    this.acquiredAmount = formatUnits(raw.acquiredAmount);
    this.deadlineDate = new Date(raw.deadlineDate.toNumber() * 1000).toISOString();
    this.installmentsCount = raw.installmentsCount;
    this.installmentsTotalAmount = formatUnits(raw.installmentsTotalAmount);
    this.installmentsNextPaymentDate = new Date(
      raw.installmentsNextPaymentDate.toNumber() * 1000,
    ).toISOString();
    this.minAmountInvest = formatUnits(raw.minAmountInvest);
    this.#creditScoreInNumber = raw.creditScore;
    this.startDate = new Date(raw.startDate.toNumber() * 1000).toISOString();
    this.createdAt = new Date(raw.createdAt.toNumber() * 1000).toISOString();
    this.totalInstallmentsPaid = raw.totalInstallmentsPaid;
    this.installmentsStartDate = subHours(
      this.installmentsNextPaymentDate,
      this.totalInstallmentsPaid,
    ).toISOString();
    // this.installmentsStartDate = subMonths(
    //   this.installmentsNextPaymentDate,
    //   this.totalInstallmentsPaid,
    // ).toISOString();
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

  public get remainingAmount(): number {
    return this.goalAmount - this.acquiredAmount;
  }

  public get interestRate(): string {
    return (
      ((this.installmentsTotalAmount / this.goalAmount - 1) * 100 * 12) /
      this.installmentsCount
    )
      .toFixed(6)
      .slice(0, -4);
  }

  public get creditScore() {
    let foundRange = this.#creditScoreRanges.find(
      (optionRange) =>
        this.#creditScoreInNumber >= optionRange.range[0] &&
        this.#creditScoreInNumber <= optionRange.range[1],
    )!;

    return foundRange;
  }

  public get installmentsList(): InstallmentsList {
    const installmentsList: InstallmentsList = [];

    for (let i = 0; i < this.installmentsCount; i++) {
      // const date = addMonths(this.installmentsStartDate, i);
      const date = addHours(this.installmentsStartDate, i * 2);
      const installmentNumber = i + 1;
      const amount = this.installmentsTotalAmount / this.installmentsCount;

      let status = InstallmentStatus.Upcoming;
      if (installmentNumber <= this.totalInstallmentsPaid) {
        status = InstallmentStatus.Paid;
      }

      if (Date.now() > date.getTime() && installmentNumber > this.totalInstallmentsPaid) {
        status = InstallmentStatus.Overdue;
      }

      installmentsList.push({
        date: date,
        installmentNumber: installmentNumber,
        amount: amount,
        status: status,
      });
    }

    return installmentsList;
  }

  public deadlineDate: string;
  public acquiredAmount: number;
  public originator: Account<"originator">;
  public installmentsCount: number;
  public installmentsNextPaymentDate: string;
  public installmentsStartDate: string;
  public minAmountInvest: number;
  public startDate: string;
  public createdAt: string;
  public installmentsTotalAmount: number;
  public totalInstallmentsPaid: number;
  public installmentsEndDate: string;

  #creditScoreInNumber: number;
  #creditScoreRanges = this.#generateCreditScoreRanges(creditScoreOptions);

  toJSON() {
    return {
      ...this,
      remainingAmount: this.remainingAmount,
      name: this.name,
      status: this.status,
      interestRate: this.interestRate,
      creditScore: this.creditScore,
      installmentsList: this.installmentsList,
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

  #generateCreditScoreRanges(creditScoreOptions_: typeof creditScoreOptions): Array<RangeOption> {
    const totalRange = 1000;
    const rangePerOption = totalRange / creditScoreOptions.length;

    return creditScoreOptions_
      .map((option, i) => {
        const startRange = Math.round(totalRange - (i + 1) * rangePerOption);
        const endRange = Math.round(totalRange - i * rangePerOption);

        return {
          range: [startRange, endRange] as [number, number],
          info: {
            code: option,
          },
        };
      })
      .reverse();
  }
}
