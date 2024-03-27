"use client";

import Image from "next/image";
import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import { Separator } from "@/components/ui/separator";

export function NavbarUserButton() {
  const { userInfo, logout } = useSession();
  const t = useTranslations("navbar");

  if (!userInfo) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="flex gap-2 rounded-full pl-3 pr-2 transition-opacity hover:opacity-50"
        >
          {userInfo && (
            <span className="text-xs font-medium">
              {userInfo.name?.split(" ")[0] ?? `${t("user")}`}
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
        <Button
          size="sm"
          variant="secondary"
          className="transition-opacity hover:opacity-50"
          onClick={logout}
        >
          {t("logout")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
