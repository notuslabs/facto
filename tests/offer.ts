import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { nanoid } from "nanoid";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
	createMint,
	getAssociatedTokenAddressSync,
	mintTo,
	getAccount,
	createAssociatedTokenAccount,
} from "@solana/spl-token";

async function airdropSol(publicKey: PublicKey, amount: number) {
	const airdropTx = await anchor
		.getProvider()
		.connection.requestAirdrop(
			publicKey,
			amount * anchor.web3.LAMPORTS_PER_SOL,
		);
	await confirmTransaction(airdropTx);
}

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

describe("Offer", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());

	const program = anchor.workspace.Hackathon as Program<Hackathon>;
	const caller = anchor.web3.Keypair.generate();
	const [originator] = PublicKey.findProgramAddressSync(
		[anchor.utils.bytes.utf8.encode("originator"), caller.publicKey.toBuffer()],
		program.programId,
	);
	const offerId = nanoid(16);
	const [offer] = PublicKey.findProgramAddressSync(
		[
			anchor.utils.bytes.utf8.encode("offer"),
			anchor.utils.bytes.utf8.encode(offerId),
		],
		program.programId,
	);

	before(async () => {
		await airdropSol(caller.publicKey, 30);
		await program.methods
			.createOriginator("test", "description")
			.accounts({
				originator,
				owner: caller.publicKey,
				payer: caller.publicKey,
			})
			.signers([caller])
			.rpc();
	});

	it("should be able to create an offer", async () => {
		const [tokenPubKey] = PublicKey.findProgramAddressSync(
			[anchor.utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
			program.programId,
		);
		const [vaultPubKey] = PublicKey.findProgramAddressSync(
			[anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
			program.programId,
		);

		const tx = await program.methods
			.createOffer(
				offerId,
				"Offer Name",
				"Offer Description",
				new BN(1664996800),
				100,
				1.5,
				3,
				null,
			)
			.accounts({
				caller: caller.publicKey,
				originator,
				payer: caller.publicKey,
				offer,
				token: tokenPubKey,
				vault: vaultPubKey,
			})
			.signers([caller])
			.rpc()
			.catch((e) => console.log(e));

		const mint = await getAccount(anchor.getProvider().connection, vaultPubKey);

		console.log(tx, mint);
	});
});
