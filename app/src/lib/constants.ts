import { env } from "@/env";
import { PublicKey } from "@solana/web3.js";

export const FAKE_MINT = new PublicKey(env.NEXT_PUBLIC_FAKE_MINT_ADDRESS);
export const DEFAULT_DECIMALS = 6;
