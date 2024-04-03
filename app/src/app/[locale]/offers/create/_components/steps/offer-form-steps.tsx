import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormContext } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AutoCalculatedCard } from "./auto-calculated-card";
import { format as formatDate, add as addDate } from "date-fns";
import {
  CreateOfferFormSchema,
  creditScoreOptions,
  paymentFrequencyOptions,
} from "../offer-form-validation";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";
import { resetDate } from "@/lib/reset-date";

type FormStepProps = {
  isAllowedToCreate: boolean;
  isCreatingInvestor: boolean;
  currentStep: number;
};

export function OfferFormStep1({
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

export function OfferFormStep2({
  isAllowedToCreate,
  isCreatingInvestor,
  currentStep,
}: FormStepProps) {
  const form = useFormContext<z.infer<typeof CreateOfferFormSchema>>();
  const t = useTranslations("create-offer-page");
  const format = useFormatter();

  const isCurrentStep = currentStep === 2;

  const toReceive = form.watch("goalAmount");
  const interestRate = form.watch("interestRatePercent");
  const installmentsCount = form.watch("installmentsCount");

  const totalInterest = toReceive * (interestRate / 100);
  const totalWithInterest = toReceive + totalInterest;
  const eachInstallment = totalWithInterest / installmentsCount;

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
      <div className="grid grid-cols-2 gap-8">
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
        <FormField
          control={form.control}
          name="installmentsCount"
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
      </div>

      <div className="grid grid-cols-3 gap-8">
        <AutoCalculatedCard title={t("each-installment")}>
          {isNaN(eachInstallment) ? (
            <span className="text-xs text-foreground">
              {t("fill-goal-amount-and-interest-rate-and-installments")}
            </span>
          ) : (
            format.number(eachInstallment, {
              style: "currency",
              currency: "USD",
            })
          )}
        </AutoCalculatedCard>
        <AutoCalculatedCard title={t("total-with-interest")}>
          {isNaN(totalWithInterest) ? (
            <span className="text-xs text-foreground">
              {t("fill-goal-amount-and-interest-rate")}
            </span>
          ) : (
            format.number(totalWithInterest, {
              style: "currency",
              currency: "USD",
            })
          )}
        </AutoCalculatedCard>
        <AutoCalculatedCard title={t("total-interest")}>
          {isNaN(totalInterest) ? (
            <span className="text-xs text-foreground">
              {t("fill-goal-amount-and-interest-rate")}
            </span>
          ) : (
            format.number(totalInterest, {
              style: "currency",
              currency: "USD",
            })
          )}
        </AutoCalculatedCard>
      </div>
    </div>
  );
}

export function OfferFormStep3({
  isAllowedToCreate,
  isCreatingInvestor,
  currentStep,
}: FormStepProps) {
  const form = useFormContext<z.infer<typeof CreateOfferFormSchema>>();
  const t = useTranslations("create-offer-page");
  const isCurrentStep = currentStep === 3;

  const instalmentsStartDate = form.watch("installmentsStartDate");
  const installmentsCount = form.watch("installmentsCount");
  const lastInstallmentDate =
    instalmentsStartDate && installmentsCount
      ? addDate(instalmentsStartDate, {
          months: installmentsCount - 1,
        })
      : null;

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
                    disabled={(date) =>
                      resetDate(date).getTime() <= resetDate(new Date()).getTime() - 1000
                    }
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePickerDemo setDate={field.onChange} date={field.value} />
                  </div>
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
                    disabled={(date) =>
                      resetDate(date).getTime() <= resetDate(new Date()).getTime() - 1000
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-8">
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
                    disabled={(date) =>
                      resetDate(date).getTime() <= resetDate(new Date()).getTime() - 1000
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <AutoCalculatedCard title={t("last-installment-date")}>
        {lastInstallmentDate
          ? formatDate(lastInstallmentDate, "P")
          : t("fill-installment-start-date-and-installments-total")}
      </AutoCalculatedCard>
    </div>
  );
}
