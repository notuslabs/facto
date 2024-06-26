import { env } from "@/env";
import { IDL } from "@/lib/idl/facto-idl-types";
import idl from "@/lib/idl/idl-facto.json";
import { Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

export function getProgram() {
  return new Program<typeof IDL>(IDL, idl.metadata.address, {
    connection: new Connection(env.NEXT_PUBLIC_RPC_URL),
  });
}
