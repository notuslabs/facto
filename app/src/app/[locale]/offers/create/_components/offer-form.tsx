"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useCreateOffer } from "@/hooks/use-create-offer";
import { useGenerateNewOfferName } from "@/hooks/use-generate-new-offer-name";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { MouseEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OfferFormStep1, OfferFormStep2, OfferFormStep3 } from "./steps/offer-form-steps";
import { toast } from "sonner";
import { flushSync } from "react-dom";
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
      path: ["startDate"],
    });

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
      message: "Installments start date must be them same or after deadline date",
      path: ["installmentsStartDate"],
    });

    ctx.addIssue({
      code: "custom",
      message: "Installments start date must be them same or after deadline date",
      path: ["deadlineDate"],
    });
  });

type OfferFormProps = {
  isLoading: boolean;
  isAllowedToCreate: boolean;
};

export function OfferForm({ isLoading, isAllowedToCreate }: OfferFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: createOffer, isPending: isCreatingOffer } = useCreateOffer();
  const { data: offerName, isPending: isGeneratingNewOfferName } = useGenerateNewOfferName();
  const t = useTranslations("create-offer-page");

  const form = useForm<z.infer<typeof CreateOfferFormSchema>>({
    resolver: zodResolver(CreateOfferFormSchema),
    defaultValues: {
      name: offerName ?? "",
      description: "",
      payment_frequency: "monthly",
      minAmountInvest: 1,
    },
  });

  form.setValue("name", offerName ?? "");

  const firstStepErrors =
    form.formState.errors.name ||
    form.formState.errors.description ||
    form.formState.errors.creditScore;

  const secondStepErrors =
    form.formState.errors.goalAmount ||
    form.formState.errors.interestRatePercent ||
    form.formState.errors.installmentsTotal;

  const thirdStepErrors =
    form.formState.errors.installmentsStartDate ||
    form.formState.errors.minAmountInvest ||
    form.formState.errors.deadlineDate ||
    form.formState.errors.startDate;

  function onSubmit(values: z.infer<typeof CreateOfferFormSchema>) {
    createOffer(values);
  }

  function goOneStepBack() {
    if (currentStep === 1) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function goNextStepOrSubmit(e: MouseEvent<HTMLButtonElement>) {
    function nextPage() {
      setCurrentStep((prev) => prev + 1);
    }

    function requestSubmit() {
      flushSync(() => {
        formRef.current?.requestSubmit();
      });
    }

    const {
      name,
      description,
      creditScore,
      goalAmount,
      interestRatePercent,
      installmentsTotal,
      installmentsStartDate,
      minAmountInvest,
      deadlineDate,
      payment_frequency,
      startDate,
    } = form.getValues();

    const filledFirstStep = name && description && creditScore;
    const filledSecondStep = goalAmount && interestRatePercent && installmentsTotal;
    const filledThirdStep = installmentsStartDate && minAmountInvest && deadlineDate && startDate;

    if (currentStep === 1) {
      if (!filledFirstStep) {
        toast.error(t("fill-all-fields-before-proceeding"));
        return;
      }

      const valid = await Promise.all([
        form.trigger("name", {
          shouldFocus: true,
        }),
        form.trigger("description", {
          shouldFocus: true,
        }),
        form.trigger("creditScore", {
          shouldFocus: true,
        }),
      ]).then((arr) => arr.every((val) => val === true));

      if (valid) {
        nextPage();
        return;
      }

      return;
    }

    if (currentStep === 2) {
      if (!filledSecondStep) {
        toast.error(t("fill-all-fields-before-proceeding"));
        e.preventDefault();
        return;
      }

      const valid = await Promise.all([
        form.trigger("goalAmount", {
          shouldFocus: true,
        }),
        form.trigger("interestRatePercent", {
          shouldFocus: true,
        }),
        form.trigger("installmentsTotal", {
          shouldFocus: true,
        }),
      ]).then((arr) => arr.every((val) => val === true));

      if (valid) {
        nextPage();
        return;
      }

      return;
    }

    if (currentStep === 3) {
      if (!filledThirdStep) {
        toast.error(t("fill-all-fields-before-proceeding"));
        return;
      }

      requestSubmit();

      return;
    }
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="w-full max-w-[178px] text-3xl font-medium">{t("header.title")}</h1>

        <div className="w-full max-w-[178px]">
          <Progress
            className="h-2"
            value={currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100}
            max={100}
            indicatorColor="bg-white"
          />
        </div>

        <span className="w-full max-w-[178px] whitespace-nowrap text-right text-sm font-medium text-muted-foreground">
          {t(`steps.step-${currentStep as 1 | 2 | 3}`)}
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative flex w-full flex-col items-center justify-start",
            isLoading && "animate-pulse",
          )}
          ref={formRef}
        >
          <OfferFormStep1
            isAllowedToCreate={isAllowedToCreate}
            isCreatingInvestor={isCreatingOffer}
            isGeneratingNewOfferName={isGeneratingNewOfferName}
            currentStep={currentStep}
          />
          <OfferFormStep2
            isAllowedToCreate={isAllowedToCreate}
            isCreatingInvestor={isCreatingOffer}
            currentStep={currentStep}
          />
          <OfferFormStep3
            isAllowedToCreate={isAllowedToCreate}
            isCreatingInvestor={isCreatingOffer}
            currentStep={currentStep}
          />
          <div className="z-[2] flex w-full items-center justify-end gap-3">
            <Button
              type="button"
              disabled={currentStep === 1}
              variant="secondary"
              onClick={goOneStepBack}
            >
              <ArrowLeft size={16} />
            </Button>
            <Button
              type="button"
              disabled={isCreatingOffer || !isAllowedToCreate || isGeneratingNewOfferName}
              onClick={goNextStepOrSubmit}
            >
              {currentStep === 3 ? t("submit-button") : t("continue-button")}
              {isCreatingOffer ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
