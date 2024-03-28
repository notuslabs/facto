import * as anchor from "@coral-xyz/anchor";
import { type PublicKey } from "@solana/web3.js";

async function confirmTransaction(tx: string) {
  const latestBlockHash = await anchor
    .getProvider()
    .connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}

export async function airdropSol(publicKey: PublicKey, amount: number) {
  const airdropTx = await anchor
    .getProvider()
    .connection.requestAirdrop(
      publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
  await confirmTransaction(airdropTx);
}

export const sleep = async (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export async function advanceTime<T extends anchor.Idl>(program: anchor.Program<T>, goalTime: number) {
  while (true) {
    const currentSlot = await program.provider.connection.getSlot()
    const currentBlocktime = await program.provider.connection.getBlockTime(currentSlot)
    if (currentBlocktime > goalTime) {
       break
    }
    sleep(1000)
 }
}
