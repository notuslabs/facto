import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";

export type CreateBorrowerParams = {
  name: string;
  description: string;
  tokenSlug: string;

  caller: Keypair;
  program: Program<Hackathon>;
};

export async function createBorrower({
  name,
  description,
  tokenSlug,
  caller,
  program,
}: CreateBorrowerParams) {
  const tx = await program.methods
    .createBorrower(name, description, tokenSlug)
    .accounts({
      payer: caller.publicKey,
      stableCoin: FAKE_MINT,
      caller: caller.publicKey,
    })
    .signers([caller])
    .rpc({ commitment: "finalized" });

  return tx;
}
