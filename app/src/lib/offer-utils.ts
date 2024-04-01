import { addMonths } from "date-fns";

export function genereateInstallmentsList({
  installmentsCount,
  installmentsStartDate,
  installmentsTotalAmount,
  totalInstallmentsPaid,
}: {
  installmentsCount: number;
  installmentsStartDate: Date;
  installmentsTotalAmount: number;
  totalInstallmentsPaid: number;
}): Array<{
  date: Date;
  installmentNumber: number;
  amount: number;
  status: "paid" | "anticipated";
}> {
  const installmentsList: Array<{
    date: Date;
    installmentNumber: number;
    amount: number;
    status: "paid" | "anticipated";
  }> = [];

  for (let i = 0; i < installmentsCount; i++) {
    const date = addMonths(installmentsStartDate, i);
    const installmentNumber = i + 1;
    const amount = installmentsTotalAmount / installmentsCount;
    const status = totalInstallmentsPaid >= installmentNumber ? "paid" : "anticipated";

    installmentsList.push({
      date: date,
      installmentNumber: installmentNumber,
      amount: amount,
      status: status,
    });
  }

  return installmentsList;
}
