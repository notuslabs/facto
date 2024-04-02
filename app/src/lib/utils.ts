import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOfferInterestRate(
  goalAmount: number,
  installmentsTotalAmount: number,
  installmentsCount: number,
) {
  return (((installmentsTotalAmount / goalAmount - 1) * 100 * 12) / installmentsCount)
    .toFixed(6)
    .slice(0, -4);
}
