"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateOffer } from "@/hooks/use-create-offer";
import { useGenerateNewOfferName } from "@/hooks/use-generate-new-offer-name";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { MouseEvent, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

const creditScoreOptions = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"] as const;
const paymentFrequencyOptions = ["monthly"] as const;

export const CreateOfferFormSchema = z.object({
  // step-1
  name: z.string().min(2).max(30),
  description: z.string().min(2).max(500),
  creditScore: z.enum(creditScoreOptions),
  // step-2
  goalAmount: z.number().positive().min(1),
  interestRatePercent: z.number().min(1),
  // step-3
  startDate: z.date(),
  deadlineDate: z.date(),
  payment_frequency: z.enum(paymentFrequencyOptions),
  installmentsStartDate: z.date(),
  installmentsTotal: z.number().int().positive().min(1),
  minAmountInvest: z.number().int().positive().min(1),
});

type OfferFormProps = {
  isLoading: boolean;
  isAllowedToCreate: boolean;
};

export function OfferForm({ isLoading, isAllowedToCreate }: OfferFormProps) {
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

  console.log(form.formState.errors);

  form.setValue("name", offerName ?? "");

  function onSubmit(values: z.infer<typeof CreateOfferFormSchema>) {
    console.log("Here");

    createOffer(values);
  }

  function goOneStepBack() {
    if (currentStep === 1) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  }

  function goNextStepOrSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (currentStep === 3) {
      return;
    }

    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
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
              type={currentStep === 3 ? "submit" : "button"}
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

type FormStepProps = {
  isAllowedToCreate: boolean;
  isCreatingInvestor: boolean;
  currentStep: number;
};

function OfferFormStep1({
  isAllowedToCreate,
  isCreatingInvestor,
  isGeneratingNewOfferName,
  currentStep,
}: FormStepProps & {
  isGeneratingNewOfferName: boolean;
}) {
  const form = useFormContext<z.infer<typeof CreateOfferFormSchema>>();
  const t = useTranslations("create-offer-page");
  const description = form.watch("description");
  const isCurrentStep = currentStep === 1;

  return (
    <div
      className={cn(
        "flex w-full max-w-[741px] flex-col gap-8 py-[118px] transition-all duration-500",
        currentStep === 2 && "absolute top-0 z-[-1] opacity-0",
        currentStep === 3 && "absolute top-0 z-[-1] opacity-0",
      )}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => {
          const [name, number] = field.value.split("#");

          return (
            <FormItem>
              <FormLabel required>{t("form-fields.name.label")}</FormLabel>
              <FormDescription>{t("form-fields.name.description")}</FormDescription>
              <FormControl>
                {isGeneratingNewOfferName && !name && !number ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div className="flex items-center justify-start">
                    <span className="flex h-10 items-center justify-center whitespace-nowrap rounded-l-md border-y border-l border-input-border bg-background px-2 text-muted-foreground">
                      {name}#
                    </span>
                    <Input disabled={true} value={number} className="rounded-l-none" />
                  </div>
                )}
              </FormControl>

              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{t("form-fields.description.label")}</FormLabel>
            <FormDescription
              data-exceeded-chars={description.length > 500 ? "true" : "false"}
              className="data-[exceeded-chars=true]:text-error-foreground"
            >
              {t("form-fields.description.description", {
                chars: description.length,
                maxChars: 500,
              })}
            </FormDescription>
            <FormControl>
              <Input
                placeholder={t("form-fields.description.placeholder")}
                disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="creditScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{t("form-fields.credit-score.label")}</FormLabel>
            <Select
              disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className={cn(!field.value && "text-muted-foreground")}>
                  <SelectValue placeholder={t("form-fields.credit-score.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {creditScoreOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function OfferFormStep2({ isAllowedToCreate, isCreatingInvestor, currentStep }: FormStepProps) {
  const form = useFormContext<z.infer<typeof CreateOfferFormSchema>>();
  const t = useTranslations("create-offer-page");
  const isCurrentStep = currentStep === 2;

  return (
    <div
      data-testid="What"
      className={cn(
        "flex w-full max-w-[741px] flex-col gap-8 py-[118px] transition-all duration-500",
        currentStep === 1 && "absolute top-0 z-[-1] opacity-0",
        currentStep === 3 && "absolute top-0 z-[-1] opacity-0",
      )}
    >
      <FormField
        control={form.control}
        name="goalAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{t("form-fields.goal-amount.label")}</FormLabel>
            <FormControl>
              <div className="flex items-center justify-start">
                <span className="flex h-10 items-center justify-center whitespace-nowrap rounded-l-md border-y border-l border-input-border bg-background px-2 text-muted-foreground">
                  {t("form-fields.goal-amount.left-text")}
                </span>
                <Input
                  disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  type="number"
                  placeholder={t("form-fields.goal-amount.placeholder")}
                  className="rounded-l-none"
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="interestRatePercent"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{t("form-fields.interest-rate.label")}</FormLabel>
            <FormControl>
              <div className="flex items-center justify-start">
                <span className="flex h-10 items-center justify-center whitespace-nowrap rounded-l-md border-y border-l border-input-border bg-background px-2 text-muted-foreground">
                  {t("form-fields.interest-rate.left-text")}
                </span>
                <Input
                  disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  type="number"
                  placeholder={t("form-fields.interest-rate.placeholder")}
                  className="rounded-l-none"
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function OfferFormStep3({ isAllowedToCreate, isCreatingInvestor, currentStep }: FormStepProps) {
  const form = useFormContext<z.infer<typeof CreateOfferFormSchema>>();
  const t = useTranslations("create-offer-page");
  const isCurrentStep = currentStep === 3;

  return (
    <div
      className={cn(
        "flex w-full max-w-[741px] flex-col gap-8 py-[118px] transition-all duration-500",
        currentStep === 1 && "absolute top-0 z-[-1] opacity-0",
        currentStep === 2 && "absolute top-0 z-[-1] opacity-0",
      )}
    >
      <div className="grid grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("form-fields.start-date.label")}</FormLabel>

              <FormDescription>{t("form-fields.start-date.description")}</FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start pl-3 text-left font-normal hover:bg-background",
                        !field.value && "text-muted-foreground hover:text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("form-fields.start-date.placeholder")}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadlineDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("form-fields.deadline-date.label")}</FormLabel>

              <FormDescription>{t("form-fields.deadline-date.description")}</FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start pl-3 text-left font-normal hover:bg-background",
                        !field.value && "text-muted-foreground hover:text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("form-fields.start-date.placeholder")}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="payment_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("form-fields.payment-frequency.label")}</FormLabel>
              <Select
                disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className={cn(!field.value && "text-muted-foreground")}>
                    <SelectValue placeholder={t("form-fields.payment-frequency.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentFrequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`form-fields.payment-frequency.options.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="installmentsTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("form-fields.installments-total.label")}</FormLabel>
              <FormControl>
                <div className="flex items-center justify-start">
                  <Input
                    disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    type="number"
                    placeholder={t("form-fields.installments-total.placeholder")}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="installmentsStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("form-fields.installments-start-date.label")}</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={isCreatingInvestor || !isAllowedToCreate || !isCurrentStep}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start pl-3 text-left font-normal hover:bg-background",
                        !field.value && "text-muted-foreground hover:text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("form-fields.installments-start-date.placeholder")}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
