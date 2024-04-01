"use client";

import { RangeOption } from "@/app/[locale]/offers/[id]/_components/offer-content";
import { creditScoreOptions } from "@/app/[locale]/offers/create/_components/offer-form-validation";
import { useTranslations } from "next-intl";

export function useGetScoreRanges(creditScore: number) {
  const creditScoreT = useTranslations("credit-scores");

  function generateCreditScoreRanges(
    creditScoreOptions_: typeof creditScoreOptions,
  ): Array<RangeOption> {
    const totalRange = 1000;
    const rangePerOption = totalRange / creditScoreOptions.length;

    return creditScoreOptions_
      .map((option, i) => {
        const startRange = Math.round(totalRange - (i + 1) * rangePerOption);
        const endRange = Math.round(totalRange - i * rangePerOption);

        return {
          range: [startRange, endRange] as [number, number],
          info: {
            code: option,
            text: creditScoreT(option),
          },
        };
      })
      .reverse();
  }

  function findRangeForNumber(optionRanges: RangeOption[], num: number): RangeOption | null {
    return (
      optionRanges.find(
        (optionRange) => num >= optionRange.range[0] && num <= optionRange.range[1],
      ) || null
    );
  }

  const ranges = generateCreditScoreRanges(creditScoreOptions);

  const foundRange = findRangeForNumber(ranges, creditScore);

  return foundRange;
}
