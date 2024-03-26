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
import { useCreateInvestor } from "@/hooks/use-create-investor";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2).max(30),
});

type InvestorFormProps = {
  isLoading: boolean;
  isAllowedToCreate: boolean;
};

export function InvestorForm({ isLoading, isAllowedToCreate }: InvestorFormProps) {
  const { mutate: createInvestor, isPending: isCreatingInvestor } = useCreateInvestor();
  const t = useTranslations("become.investor");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const name = form.watch("name");

  function onSubmit(values: z.infer<typeof FormSchema>) {
    createInvestor(values.name);
  }

  console.log({
    isLoading,
    isAllowedToCreate,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col items-center justify-start", isLoading && "animate-pulse")}
      >
        <div className="py-[118px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
                <FormControl className="w-[741px] max-w-full">
                  <Input
                    placeholder={t("form-fields.name-placeholder")}
                    disabled={isCreatingInvestor || !isAllowedToCreate}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <Button type="submit" disabled={isCreatingInvestor || !isAllowedToCreate}>
            {t("submit-button")}
            {isCreatingInvestor ? (
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
