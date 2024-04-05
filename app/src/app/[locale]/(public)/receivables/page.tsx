import { PageProps } from "@/lib/types";
import { RequireAuthProvider } from "@/providers/require-auth-provider";
import { unstable_setRequestLocale } from "next-intl/server";
import { ReceivablesPageTemplate } from "./_components/receivables-page-template";

export default function ReceivablesPage({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);
  
  return (
    <RequireAuthProvider>
      <ReceivablesPageTemplate params={params} />
    </RequireAuthProvider>
  );
}
