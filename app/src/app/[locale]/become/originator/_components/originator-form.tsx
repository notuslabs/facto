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
import { useCreateOriginator } from "@/hooks/use-create-originator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().min(2).max(500),
});

type InvestorFormProps = {
  isLoading: boolean;
  isAllowedToCreate: boolean;
};

export function OriginatorForm({ isLoading, isAllowedToCreate }: InvestorFormProps) {
  const { mutate: createOriginator, isPending: isCreatingOriginator } = useCreateOriginator();
  const t = useTranslations("become.originator");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const name = form.watch("name");
  const description = form.watch("description");

  function onSubmit(values: z.infer<typeof FormSchema>) {
    createOriginator({
      name: values.name,
      description: values.description,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col items-center justify-start", isLoading && "animate-pulse")}
      >
        <div className="flex flex-col gap-8 py-[118px]">
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
                    disabled={isCreatingOriginator || !isAllowedToCreate}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
                    disabled={isCreatingOriginator || !isAllowedToCreate}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <Button type="submit" disabled={isCreatingOriginator || !isAllowedToCreate}>
            {t("submit-button")}
            {isCreatingOriginator ? (
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
