import { config } from "@/lib/web3AuthService";
import { Connection } from "@solana/web3.js";

export function getConnection() {
  return new Connection(config.chainConfig.rpcTarget, "confirmed");
}
