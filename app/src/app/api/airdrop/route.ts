import { env } from "@/env";
import {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { z } from "zod";

export async function POST(request: Request) {
  const connection = new Connection(env.NEXT_PUBLIC_RPC_URL, "finalized");
  const result = z.object({ address: z.string().min(2) }).safeParse(await request.json());

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.errors[0].message }), { status: 400 });
  }

  const { address } = result.data;

  const paymasterPrivateKey = env.PAYMASTER_PRIVATE_KEY.split(",").map(Number);
  const paymaster = Keypair.fromSecretKey(new Uint8Array(paymasterPrivateKey));

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: paymaster.publicKey,
      toPubkey: new PublicKey(address),
      lamports: LAMPORTS_PER_SOL * 1.5,
    }),
  );
  await sendAndConfirmTransaction(connection, transaction, [paymaster], {
    commitment: "finalized",
  });

  return new Response(null, { status: 204 });
}
