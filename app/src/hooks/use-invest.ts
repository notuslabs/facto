import { useMutation } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { toast } from "sonner";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { parseUnits } from "@/lib/parse-units";

class InvestError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

type InvestParams = {
  offerId: string;
  amount: number;
};

export function useInvest() {
  const { data: programData } = useProgram();

  const program = programData?.program;
  const keypair = programData?.keypair;

  return useMutation({
    mutationFn: async ({ offerId, amount }: InvestParams) => {
      if (!program) {
        throw new InvestError("Program not found");
      }

      if (!keypair) {
        throw new InvestError("Keypair not found");
      }

      const [offerPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(offerId)],
        program.programId,
      );

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), keypair.publicKey.toBuffer()],
        program.programId,
      );
      const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      const [investorOfferTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_offer_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      const [vaultStableTokenAccountPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("offer_vault"), offerPubKey.toBuffer()],
        program.programId,
      );

      const tx = await program.methods
        .invest(offerId, new BN(parseUnits(amount, 8).toString()))
        .accounts({
          caller: keypair.publicKey,
          payer: keypair.publicKey,
          stableToken: FAKE_MINT,
          investorStableTokenAccount: investorTokenAccountPubKey,
          investorOfferTokenAccount: investorOfferTokenAccountPubKey,
          vaultStableTokenAccount: vaultStableTokenAccountPubKey,
        })
        .signers([keypair])
        .rpc();
      console.log(tx);

      return tx;
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof InvestError) {
        toast.error(error.message);
      }
    },
  });
}
