import { InvestmentsPageContent } from "./_components/content";
import { InvestmentsPageHeader } from "./_components/header";

export default function OldInvestmentsPage() {
  return (
    <div className="min-h-[calc(100vh-153px)] dark:bg-zinc-100">
      <InvestmentsPageHeader />
      <InvestmentsPageContent />
    </div>
  );
}
