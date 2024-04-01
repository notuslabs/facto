import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOfferInterestRate(goalAmount: number, installmentsTotalAmount: number) {
  return installmentsTotalAmount / goalAmount;
}
