import { Hackathon } from "@/lib/idl/facto-idl-types";
import { Program } from "@coral-xyz/anchor";
import { Signer } from "@solana/web3.js";
export type ClaimInstallmentProps = {
  offerId: string;

  caller: Signer;
  program: Program<Hackathon>;
};

export async function claimInstallment({ program, caller, offerId }: ClaimInstallmentProps) {
  const claimTx = await program.methods
    .withdrawInstallment(offerId)
    .accounts({
      caller: caller.publicKey,
    })
    .signers([caller])
    .rpc({ commitment: "finalized" });

  return claimTx;
}
