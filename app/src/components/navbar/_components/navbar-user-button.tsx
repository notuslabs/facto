"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";
import LocaleSwitcher from "@/components/locale-switcher";
import { Separator } from "@/components/ui/separator";
import { NavbarVariant } from "..";
import { cn } from "@/lib/utils";

type NavbarUserButtonProps = {
  variant?: NavbarVariant;
};

export function NavbarUserButton({ variant }: NavbarUserButtonProps) {
  const { data } = useSession();
  const { logout } = useAuth();
  const t = useTranslations("navbar");
  const userInfo = data?.userInfo;

  console.log({ variant });

  if (!userInfo) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn("flex gap-2 rounded-full pl-3 pr-2", variant === "none" && "p-1")}
        >
          {userInfo && variant !== "none" && (
            <span className="text-xs font-medium">
              {/* TODO: add translation */}
              {variant === "investor" ? "Investor" : "Borrower"}
            </span>
          )}
          {userInfo.profileImage && (
            <Image
              src={userInfo.profileImage}
              alt={userInfo.name ?? "Avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-36 flex-col gap-2 border-0 pt-1">
        <LocaleSwitcher />
        <Separator />
        <Button size="sm" variant="secondary" onClick={() => logout()}>
          {t("logout")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
