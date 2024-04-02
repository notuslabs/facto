import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { Program, utils } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

export type CreateOriginatorParams = {
  name: string;
  description: string;
  tokenSlug: string;

  caller: Keypair;
  program: Program<Hackathon>;
};

export async function createOriginator({
  name,
  description,
  tokenSlug,
  caller,
  program,
}: CreateOriginatorParams) {
  const tx = await program.methods
    .createOriginator(name, description, tokenSlug)
    .accounts({
      payer: caller.publicKey,
      stableCoin: FAKE_MINT,
      caller: caller.publicKey,
    })
    .signers([caller])
    .rpc({ commitment: "processed" });

  return tx;
}
