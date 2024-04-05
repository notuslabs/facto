import { PageProps } from "@/lib/types";
import { RequireAuthProvider } from "@/providers/require-auth-provider";
import { unstable_setRequestLocale } from "next-intl/server";
import { InvestmentsPageTemplate } from "./_components/investments-page-template";

export default function InvestmentsPage({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);
  return (
    <RequireAuthProvider>
      <InvestmentsPageTemplate params={params} />
    </RequireAuthProvider>
  );
}
