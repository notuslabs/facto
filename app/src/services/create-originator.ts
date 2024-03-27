import { Program, utils } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

export type CreateOriginatorParams = {
  name: string;
  description: string;
  tokenSlug: string;

  caller: Keypair;
  program: Program;
};

export async function createOriginator({
  name,
  description,
  tokenSlug,
  caller,
  program,
}: CreateOriginatorParams) {
  const [originator] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("originator"), caller.publicKey.toBuffer()],
    program.programId,
  );

  const tx = await program.methods
    .createOriginator(name, description, tokenSlug)
    .accounts({
      originator,
      payer: caller.publicKey,
      caller: caller.publicKey,
    })
    .signers([caller])
    .rpc({ commitment: "processed" });

  return tx;
}
