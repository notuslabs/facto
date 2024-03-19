import { config } from "@/lib/web3AuthService";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";

export function useConnection() {
  const connection = useMemo(() => new Connection(config.chainConfig.rpcTarget), []);

  return { connection };
}
