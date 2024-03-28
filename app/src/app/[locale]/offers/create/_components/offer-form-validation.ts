import { z } from "zod";
import { isBefore, isSameDay } from "date-fns";

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
export const paymentFrequencyOptions = ["monthly"] as const;

export const CreateOfferFormSchema = z
  .object({
    // step-1
    name: z.string().min(2).max(30),
    description: z.string().min(2).max(500),
    creditScore: z.enum(creditScoreOptions),
    // step-2
    goalAmount: z.number().positive().min(1),
    interestRatePercent: z.number().min(1),
    // step-3
    startDate: z.date().refine((date) => {
      console.log({
        isBefore: isBefore(new Date(), date),
        isSameDay: isSameDay(new Date(), date),
        result: isBefore(new Date(), date) || isSameDay(new Date(), date),
      });

      return isBefore(new Date(), date) || isSameDay(new Date(), date);
    }, "Start date must be the same or after current date"),
    deadlineDate: z
      .date()
      .refine(
        (date) => isBefore(new Date(), date) || isSameDay(new Date(), date),
        "Start date must be the same or after current date",
      ),
    payment_frequency: z.enum(paymentFrequencyOptions),
    installmentsStartDate: z
      .date()
      .refine(
        (date) => isBefore(new Date(), date) || isSameDay(new Date(), date),
        "Start date must be the same or after current date",
      ),
    installmentsTotal: z.number().int().positive().min(1),
    minAmountInvest: z.number().int().positive().min(1),
  })
  .superRefine((data, ctx) => {
    if (
      isBefore(data.startDate, data.deadlineDate) ||
      isSameDay(data.startDate, data.deadlineDate)
    ) {
      return true;
    }

    ctx.addIssue({
      code: "custom",
      message: "Deadline date must be the same or after start date",
      path: ["deadlineDate"],
    });
  })
  .superRefine((data, ctx) => {
    if (
      isBefore(data.deadlineDate, data.installmentsStartDate) ||
      isSameDay(data.deadlineDate, data.installmentsStartDate)
    ) {
      return true;
    }

    ctx.addIssue({
      code: "custom",
      message: "Installments start date must be the same or after deadline date",
      path: ["installmentsStartDate"],
    });
  });
