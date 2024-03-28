import TransactionsContent from "./_components/transactions-content";
import TransactionsHeader from "./_components/transactions-header";

export default function TransactionsPage() {
  return (
    <main className="flex h-screen flex-col gap-[60px] p-4 md:container md:p-10">
      <TransactionsHeader />
      <TransactionsContent />
    </main>
  );
}
