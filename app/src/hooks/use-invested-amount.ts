"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "./use-program";
import { getAccount } from "@solana/spl-token";
import { getConnection } from "@/services/get-connection";

export function useInvestedAmount(offerId: string) {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["invested-amount", offerId, program?.programId.toString()],
    queryFn: async () => {
      if (!program || !keypair) return 0;

      const connection = getConnection();

      const [offerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(offerId)],
        program.programId,
      );

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );

      const [investorOfferTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("investor_offer_token_account"),
          offerPubKey.toBuffer(),
          investorPubKey.toBuffer(),
        ],
        program.programId,
      );

      const investorOfferTokenAccount = await getAccount(
        connection,
        investorOfferTokenAccountPubKey,
      ).catch(console.error);

      return investorOfferTokenAccount
        ? parseFloat(investorOfferTokenAccount.amount.toString()) / 10 ** 9
        : 0;
    },
    enabled: !!program && !!keypair,
  });
}
