import { env } from "@/env";
import { parseUnits } from "@/lib/parse-units";
import { getAccount, mintTo } from "@solana/spl-token";
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
import { z } from "zod";

export async function POST(request: Request) {
  const connection = new Connection(env.NEXT_PUBLIC_RPC_URL, "finalized");
  const result = z
    .object({ address: z.string().min(2), amount: z.number() })
    .safeParse(await request.json());

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.errors[0].message }), { status: 400 });
  }

  const { address, amount } = result.data;

  const paymasterPrivateKey = env.PAYMASTER_PRIVATE_KEY.split(",").map(Number);
  const paymaster = Keypair.fromSecretKey(new Uint8Array(paymasterPrivateKey));

  const toWallet = await getAccount(connection, new PublicKey(address));

  let tx = await mintTo(
    connection,
    paymaster,
    new PublicKey(env.NEXT_PUBLIC_FAKE_MINT_ADDRESS),
    toWallet.address,
    paymaster.publicKey,
    parseUnits(amount).toNumber(),
  );

  return new Response(JSON.stringify({ tx }), { status: 200 });
}
