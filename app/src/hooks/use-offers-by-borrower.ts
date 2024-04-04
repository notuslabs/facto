"use client";

import { listOffersByBorrower } from "@/services/list-offers";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./use-program";
import { utils } from "@coral-xyz/anchor";

export function useOffersByBorrower(filter?: string[]) {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["offers-by-borrower", filter, keypair?.publicKey.toString()],
    queryFn: () => {
      if (!keypair || !program) return null;

      const [borrowerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("borrower"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      console.log("borrower key", borrowerPubKey);

      return listOffersByBorrower(borrowerPubKey, filter);
    },
    enabled: !!program && !!keypair,
  });
}
