import { PageProps } from "@/lib/types";
import { InvestmentsPageContent } from "./_components/content";
import { InvestmentsPageHeader } from "./_components/header";
import { unstable_setRequestLocale } from "next-intl/server";

export default function InvestmentsPage({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);
  return (
    <div className="min-h-[calc(100vh-153px)] dark:bg-zinc-100">
      <InvestmentsPageHeader />
      <InvestmentsPageContent />
    </div>
  );
}
