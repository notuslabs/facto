import { IdlAccounts } from "@coral-xyz/anchor";
import { IDL } from "@/lib/idl/facto-idl-types";
import { getProgram } from "@/services/get-program";
import { addMonths, subMonths, addHours, subHours } from "date-fns";
import { formatUnits } from "@/lib/format-units";

type Account<T extends keyof IdlAccounts<typeof IDL>> = IdlAccounts<typeof IDL>[T];

export type RawOfferAccount = Account<"offer">;
export enum OfferStatus {
  StartingSoon = "starting-soon",
  Open = "open",
  Funded = "funded",
  OnTrack = "on-track",
  Finished = "finished",
  Delinquent = "delinquent",
  Failed = "failed",
  Cancelled = "cancelled",
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
  private constructor(raw: Account<"offer">, rawBorrower: Account<"borrower">) {
    this.id = raw.id;
    this.description = raw.description;
    this.discriminator = raw.discriminator;
    this.goalAmount = formatUnits(raw.goalAmount);
    this.borrower = rawBorrower;
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
    return `${this.borrower.tokenSlug}#${this.discriminator}`;
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
  public borrower: Account<"borrower">;
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
    const borrowerPubKey = raw.account.borrower;
    const borrower = await program.account.borrower.fetch(borrowerPubKey);

    const offer = new Offer(raw.account, borrower);

    return offer;
  }

  static async fromRawCollection(raw: { account: RawOfferAccount }[]) {
    const program = getProgram();

    const borrowersPubKeys = raw.map((offer) => offer.account.borrower);
    const borrowers = (await program.account.borrower.fetchMultiple(
      borrowersPubKeys,
    )) as Account<"borrower">[];

    return raw
      .map((offer, index) => new Offer(offer.account, borrowers[index]))
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
