import type { IdlAccounts } from "@coral-xyz/anchor";
import type { IDL } from "@/lib/idl";

type Account<T extends keyof IdlAccounts<typeof IDL>> = IdlAccounts<
	typeof IDL
>[T];

export type Originator = Account<"originator">;
export type Offer = Account<"offer"> & { originator: Originator };
