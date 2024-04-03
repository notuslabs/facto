"use client";

import { listOffersByOriginator } from "@/services/list-offers";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./use-program";
import { utils } from "@coral-xyz/anchor";

export function useOffersByOriginator(filter?: string[]) {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["offers-by-originator", filter, keypair?.publicKey.toString()],
    queryFn: () => {
      if (!keypair || !program) return null;

      const [originatorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("originator"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      console.log("originator key", originatorPubKey);

      return listOffersByOriginator(originatorPubKey, filter);
    },
    enabled: !!program && !!keypair,
  });
}
