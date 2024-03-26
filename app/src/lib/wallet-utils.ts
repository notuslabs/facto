import { Keypair } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";

export function getKeypairFromPrivateKey(privateKey: string) {
  return Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
}

export async function getPrivateKey(solanaWallet: SolanaWallet) {
  const privateKey = await solanaWallet.request<unknown, string>({
    method: "solanaPrivateKey",
    params: [],
  });

  return privateKey;
}
