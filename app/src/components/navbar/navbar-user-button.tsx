"use client";

import Image from "next/image";
import { useSession } from "../auth-provider";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavbarUserButton() {
  const { userInfo } = useSession();

  if (!userInfo) return null;

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-full p-1 pr-3 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-950",
        !userInfo.profileImage && "pl-3",
      )}
    >
      {userInfo.profileImage && (
        <Image
          src={userInfo.profileImage}
          alt={userInfo.name ?? "Avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}

      <div className="flex items-center justify-start gap-1 text-foreground">
        <div className="w-full font-medium">
          <span className="text- block text-start text-sm">{userInfo?.name}</span>
          <span className="block text-xs text-muted-foreground">{userInfo?.email}</span>
        </div>
        <ChevronDown size={12} className="text-foreground" />
      </div>
    </button>
  );
}
