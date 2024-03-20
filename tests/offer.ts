import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
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
	const wallet = anchor.web3.Keypair.generate();
	let walletTokenAccount: anchor.web3.PublicKey;
	let tokenPublicKey: anchor.web3.PublicKey;
	const tokenAccountAuthority = anchor.web3.Keypair.generate();

	before(async () => {
		await airdropSol(wallet.publicKey, 10); // drops 10 solana to wallet account

		tokenPublicKey = await createMint(
			anchor.getProvider().connection,
			wallet,
			wallet.publicKey,
			wallet.publicKey,
			9,
		); // creates token with 9 decimals

		walletTokenAccount = await createAssociatedTokenAccount(
			anchor.getProvider().connection,
			wallet,
			tokenPublicKey,
			wallet.publicKey,
		); // creates token account for wallet (this will receive the tokens further on)
	});

	it("should be able to create an offer", async () => {
		const tokenAccount = getAssociatedTokenAddressSync(
			tokenPublicKey,
			tokenAccountAuthority.publicKey,
		); // discovers the public key of the token account for the wallet (this token account will be created in the program)

		const [originatorPubKey] = PublicKey.findProgramAddressSync(
			[
				anchor.utils.bytes.utf8.encode("originator"),
				wallet.publicKey.toBuffer(),
			],
			program.programId,
		); // discovers the public key of the originator account

		await program.methods
			.createOriginator("test", "description")
			.accounts({
				originator: originatorPubKey, // this is using PDA (seeds) to create the originator account so that's why we need to discover the public key before
				payer: wallet.publicKey,
				owner: wallet.publicKey,
			})
			.signers([wallet])
			.rpc();

		const [offerPubKey] = PublicKey.findProgramAddressSync(
			[anchor.utils.bytes.utf8.encode("offer"), originatorPubKey.toBuffer()],
			program.programId,
		); // discovers the public key of the offer account

		const tx = await program.methods
			.createOffer("BINVEST")
			.accounts({
				mint: tokenPublicKey, // the token public key
				payer: wallet.publicKey,
				tokenAccount, // the token account public key that we discovered earlier (this is will be created in the program and only the program will have access to it)
				offer: offerPubKey, // the offer public key that we discovered earlier (this is will be created in the program and only the program will have access to it)
				originator: originatorPubKey, // the originator public key that we discovered earlier (this is will be created in the program and only the program will have access to it)
				owner: wallet.publicKey, // the owner of the offer (this is the wallet that will be able to withdraw the tokens from the offer in theory)
				tokenAccountAuthority: tokenAccountAuthority.publicKey, // the token account authority that we discovered earlier (this is will be created in the program and only the program will have access to it)
			})
			.signers([wallet, tokenAccountAuthority])
			.rpc();

		console.log("offer created", tx);

		await mintTo(
			anchor.getProvider().connection,
			wallet,
			tokenPublicKey,
			tokenAccount,
			wallet,
			100,
		);

		let walletTokenAccountInfo = await getAccount(
			anchor.getProvider().connection,
			walletTokenAccount,
		);
		console.log(walletTokenAccountInfo); // so lets print our token account info (balance, owner, etc) the balance should be 0

		const tx2 = await program.methods
			.withdrawInvestments()
			.accounts({
				tokenAccount, // the token account public key that the programs owns, this is the token account that currently holds the tokens
				tokenAccountAuthority: tokenAccountAuthority.publicKey, // the token account authority (owner of the token account) needs to sign this transaction
				from: tokenAccountAuthority.publicKey, // the token account authority (owner of the token account) needs to sign this transaction
				mint: tokenPublicKey, // the token public key
				destination: walletTokenAccount, // the token account public key that the wallet owns, this is the token account that will receive the tokens
				payer: wallet.publicKey, // the wallet that will pay for the transaction (SOLs)
			})
			.signers([wallet, tokenAccountAuthority])
			.rpc();

		walletTokenAccountInfo = await getAccount(
			anchor.getProvider().connection,
			walletTokenAccount,
		);
		console.log(walletTokenAccountInfo); // so lets print our token account info (balance, owner, etc) the balance should be 12 because that's what the program transferred to the wallet token account

		console.log("Your transaction signature", tx2);
	});
});
