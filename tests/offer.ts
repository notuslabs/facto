import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { Keypair, type PublicKey } from "@solana/web3.js";

async function airdropSol(publicKey: PublicKey, amount: number) {
	const airdropTx = await anchor
		.getProvider()
		.connection.requestAirdrop(
			publicKey,
			amount * anchor.web3.LAMPORTS_PER_SOL,
		);
	await confirmTransaction(airdropTx);
}

async function sleep(ms: number) {
	return new Promise((resolve, reject) => setTimeout(resolve, ms));
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

	it("should be able to create an offer", async () => {
		const offer = anchor.web3.Keypair.generate();
		const owner = anchor.web3.Keypair.generate();

		await airdropSol(owner.publicKey, 1);

		const tx = await program.methods
			.createOffer("BINVEST")
			.accounts({
				offer: offer.publicKey,
				owner: owner.publicKey,
				payer: owner.publicKey,
			})
			.signers([offer, owner])
			.rpc();
		console.log(await program.account.offer.fetch(offer.publicKey));
		console.log("Your transaction signature", tx);
	});
});
