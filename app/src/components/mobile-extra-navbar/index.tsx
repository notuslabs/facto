"use client";

import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { CircleDollarSign, HelpingHand, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileExtraNavbar() {
  const { data } = useSession();

  const userInfo = data?.userInfo;

  const t = useTranslations("navbar");
  const pathname = usePathname();

  const options = [
    {
      key: 1,
      name: t("transactions"),
      href: "/transactions" as const,
      icon: <CircleDollarSign size={20} />,
    },
    {
      key: 2,
      name: t("my-investments"),
      href: "/investments" as const,
      icon: <HelpingHand size={20} />,
    },
    {
      key: 3,
      name: t("receivables"),
      href: "/receivables" as const,
      icon: <Receipt size={20} />,
    },
  ];

  if (!userInfo) return null;

  return (
    <div className="sticky bottom-0 flex items-start justify-between bg-primary-foreground p-4 text-xs md:hidden">
      {options.map((option) => (
        <Link
          href={option.href}
          className={cn(
            pathname === option.href && "!text-facto-primary",
            "flex w-1/3 flex-col items-center gap-2 text-center text-muted-foreground transition-colors",
          )}
          key={option.key}
        >
          <span
            className={cn(
              pathname === option.href
                ? "rounded-full bg-muted text-facto-primary"
                : "bg-transparent",
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
