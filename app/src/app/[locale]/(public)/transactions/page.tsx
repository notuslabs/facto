import { RequireAuthProvider } from "@/providers/require-auth-provider";
import TransactionsContent from "./_components/transactions-content";
import TransactionsHeader from "./_components/transactions-header";

export default function TransactionsPage() {
  return (
    <RequireAuthProvider>
      <TransactionsPageTemplate />
    </RequireAuthProvider>
  );
}

function TransactionsPageTemplate() {
  return (
    <main className="flex flex-col gap-6 md:container md:p-10">
      <TransactionsHeader />
      <TransactionsContent />
    </main>
  );
}
