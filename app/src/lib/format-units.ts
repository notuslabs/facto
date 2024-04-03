import BN from "bn.js";
import { DEFAULT_DECIMALS } from "./constants";
/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a number..
 *
 * @example
 * import { formatUnits } from '@/lib'
 *
 * formatUnits(420000000000n, 9)
 * // 420
 */
export function formatUnits(value: bigint | string | BN, decimals: number = DEFAULT_DECIMALS) {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  const num = Number(`${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`);
  if (num > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Number is too large to be represented in JavaScript. Value: ${num}`);
  }
  return num;
}
