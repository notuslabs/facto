"use client";

import { useQueryEvents } from "@/hooks/use-query-events";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

export function RequireAuthProvider({ children }: PropsWithChildren) {
  const sessionQuery = useSession();
  const t = useTranslations();
  const router = useRouter();

  useQueryEvents(sessionQuery, {
    onError: (error) => {
      console.error(error);
      toast.error(t("not-authenticated"));
      router.push("/");
    },
  });

  return <>{children}</>;
}
