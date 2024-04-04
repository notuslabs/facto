"use client";

import { Button } from "@/components/ui/button";
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
import { useCreateBorrower } from "@/hooks/use-create-borrower";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const BorrowerFormSchema = z.object({
  name: z.string().min(2).max(30),
  tokenSlug: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9]+$/, "Token slug must be all uppercase without separators"),
  description: z.string().min(2).max(500),
});

type InvestorFormProps = {
  isLoading: boolean;
  isAllowedToCreate: boolean;
};

export function BorrowerForm({ isLoading, isAllowedToCreate }: InvestorFormProps) {
  const { mutate: createBorrower, isPending: isCreatingBorrower } = useCreateBorrower();
  const t = useTranslations("become.borrower");

  const form = useForm<z.infer<typeof BorrowerFormSchema>>({
    resolver: zodResolver(BorrowerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tokenSlug: "",
    },
  });

  const name = form.watch("name");
  const tokenSlug = form.watch("tokenSlug");
  const description = form.watch("description");

  function onSubmit(values: z.infer<typeof BorrowerFormSchema>) {
    createBorrower(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col items-center justify-start", isLoading && "animate-pulse")}
      >
        <div className="flex w-[741px] flex-col gap-8 py-[118px]">
          <div className="grid grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel required>{t("form-fields.name")}</FormLabel>
                  <FormDescription
                    data-exceeded-chars={name.length > 30 ? "true" : "false"}
                    className="data-[exceeded-chars=true]:text-error-foreground"
                  >
                    {t("form-fields.name-description", {
                      chars: name.length,
                      maxChars: 30,
                    })}
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder={t("form-fields.name-placeholder")}
                      disabled={isCreatingBorrower || !isAllowedToCreate}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokenSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t("form-fields.token")}</FormLabel>
                  <FormDescription
                    data-exceeded-chars={name.length > 30 ? "true" : "false"}
                    className="data-[exceeded-chars=true]:text-error-foreground"
                  >
                    {t("form-fields.token-description", {
                      chars: tokenSlug.length,
                      maxChars: 30,
                    })}
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder={t("form-fields.token-placeholder")}
                      disabled={isCreatingBorrower || !isAllowedToCreate}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("form-fields.description")}</FormLabel>
                <FormDescription
                  data-exceeded-chars={description.length > 500 ? "true" : "false"}
                  className="data-[exceeded-chars=true]:text-error-foreground"
                >
                  {t("form-fields.name-description", {
                    chars: description.length,
                    maxChars: 500,
                  })}
                </FormDescription>
                <FormControl className="w-[741px] max-w-full">
                  <Input
                    placeholder={t("form-fields.description-placeholder")}
                    disabled={isCreatingBorrower || !isAllowedToCreate}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <Button type="submit" disabled={isCreatingBorrower || !isAllowedToCreate}>
            {t("submit-button")}
            {isCreatingBorrower ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
