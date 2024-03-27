"use client";

import { pathnames } from "@/config";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { CircleDollarSign, HelpingHand, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "../auth-provider";

export default function MobileExtraNavbar() {
  const { userInfo } = useSession();

  const t = useTranslations("navbar");
  const pathname = usePathname();

  const options = [
    {
      key: 1,
      name: t("transactions"),
      href: "/transactions",
      icon: <CircleDollarSign size={16} />,
    },
    {
      key: 2,
      name: t("my-investments"),
      href: "/investments",
      icon: <HelpingHand size={16} />,
    },
    {
      key: 3,
      name: t("receivables"),
      href: "/receivables",
      icon: <Receipt size={16} />,
    },
  ];

  if (!userInfo) return null;

  return (
    <div className="sticky bottom-0 flex items-start justify-between bg-primary p-4 text-xs dark:bg-primary-foreground md:hidden">
      {options.map((option) => (
        <Link
          href={option.href as keyof typeof pathnames}
          className={cn(
            pathname === option.href && "!text-primary",
            "flex w-1/3 flex-col items-center gap-2 text-center text-disabled-foreground transition-colors dark:text-muted-foreground",
          )}
          key={option.key}
        >
          <span
            className={cn(
              pathname === option.href ? "rounded-full bg-strong dark:bg-muted" : "bg-transparent",
              "px-3 py-1",
            )}
          >
            {option.icon}
          </span>{" "}
          <span>{option.name}</span>
        </Link>
      ))}
    </div>
  );
}
