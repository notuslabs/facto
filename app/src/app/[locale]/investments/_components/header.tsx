"use client";

import { useSession } from "@/components/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpingHand } from "lucide-react";

export function InvestmentsPageHeader() {
  const { userInfo, isLoading } = useSession();

  if (!isLoading && !userInfo) return null;

  return (
    <div className="min-h-[270px] dark:bg-primary-foreground">
      <div className="container">
        <div className="flex items-start justify-between gap-4 px-[88px]">
          <div className="flex flex-col items-start justify-start gap-2">
            {isLoading ? (
              <Skeleton className="h-[58px] w-96 rounded-lg bg-muted-foreground" />
            ) : (
              <h1 className="text-5xl font-bold leading-[3.625rem]">{userInfo?.name}</h1>
            )}
            {isLoading ? (
              <Skeleton className="h-6 w-24 rounded-lg bg-muted-foreground" />
            ) : (
              <span className="inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium dark:bg-emerald-300 dark:text-gray-950 dark:hover:bg-emerald-400">
                <HelpingHand size={12} />
                Investidor Platinum
              </span>
            )}
          </div>

          <div className="flex flex-col items-start justify-end gap-2 text-right">
            {isLoading ? (
              <Skeleton className="h-[58px] w-80 rounded-lg bg-muted-foreground" />
            ) : (
              <span className="block w-full text-right text-5xl font-bold leading-[3.625rem] text-emerald-300">
                $145.476,14
              </span>
            )}
            {isLoading ? (
              <div className="flex w-full items-center justify-end">
                <Skeleton className="h-6 w-24 rounded-lg bg-muted-foreground" />
              </div>
            ) : (
              <span className="block w-full text-right text-lg font-medium leading-[1.875rem] text-primary">
                Saldo disponível
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
