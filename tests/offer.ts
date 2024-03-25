import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { nanoid } from "nanoid";
import { PublicKey } from "@solana/web3.js";
import {
  createMint,
  getAssociatedTokenAddressSync,
  mintTo,
  getAccount,
  createAssociatedTokenAccount,
} from "@solana/spl-token";
import { assert } from "chai";

async function airdropSol(publicKey: PublicKey, amount: number) {
  const airdropTx = await anchor
    .getProvider()
    .connection.requestAirdrop(
      publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
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
    program.programId
  );
  const offerId = nanoid(16);
  const [offer] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("offer"),
      anchor.utils.bytes.utf8.encode(offerId),
    ],
    program.programId
  );
  let stableTokenPubKey: PublicKey;

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

    stableTokenPubKey = await createMint(
      anchor.getProvider().connection,
      caller,
      caller.publicKey,
      caller.publicKey,
      9
    );
  });

  it("should be able to create an offer", async () => {
    const [tokenPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
      program.programId
    );
    const [vaultPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
      program.programId
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
        null
      )
      .accounts({
        caller: caller.publicKey,
        originator,
        payer: caller.publicKey,
        offer,
        token: tokenPubKey,
        stableToken: stableTokenPubKey,
        vault: vaultPubKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const mint = await getAccount(anchor.getProvider().connection, vaultPubKey);

    console.log(tx, mint);
  });

  it("should be able to deposit in the offer", async () => {
    const investAmount = 50n;

    const investorTokenAccount = await createAssociatedTokenAccount(
      anchor.getProvider().connection,
      caller,
      stableTokenPubKey,
      caller.publicKey
    );

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
      program.programId
    );

    const [originatorPubKey] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("originator"),
        caller.publicKey.toBuffer(),
      ],
      program.programId
    );

    await mintTo(
      anchor.getProvider().connection,
      caller,
      stableTokenPubKey,
      investorTokenAccount,
      caller,
      100
    );

    const initialInvestorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccount
    );
    console.log(
      "investor token amount usdc",
      initialInvestorTokenAccountInfo.amount
    );

    const [offerTokenPublicKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
      program.programId
    );

    const investorOfferTokenAccount = getAssociatedTokenAddressSync(
      offerTokenPublicKey,
      caller.publicKey
    );

    const tx1 = await program.methods
      .invest(new anchor.BN(investAmount.toString()))
      .accounts({
        vaultTokenAccount,
        caller: caller.publicKey,
        investorOfferTokenAccount,
        investorTokenAccount,
        payer: caller.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
      })
      .signers([caller, caller])
      .rpc()
      .catch(console.error);

    let investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    let vaultTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      vaultTokenAccount
    );
    console.log(
      "investor offer token account amount",
      investorOfferTokenAccountInfo.amount
    );
    console.log("vault token account amount", vaultTokenAccountInfo.amount);

    const investorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccount
    );
    console.log(
      "investor token amount usdc after invest",
      investorTokenAccountInfo.amount
    );

    console.log("Your transaction signature", tx1);

    assert(
      initialInvestorTokenAccountInfo.amount - investAmount ===
        investorTokenAccountInfo.amount
    );
    assert(investorOfferTokenAccountInfo.amount === investAmount);
    assert(vaultTokenAccountInfo.amount === investAmount);

    const tx2 = await program.methods
      .invest(new anchor.BN(investAmount.toString()))
      .accounts({
        vaultTokenAccount,
        caller: caller.publicKey,
        investorOfferTokenAccount,
        investorTokenAccount,
        payer: caller.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
      })
      .signers([caller, caller])
      .rpc()
      .catch(console.error);

    investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    vaultTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      vaultTokenAccount
    );

    assert(investorOfferTokenAccountInfo.amount === investAmount * 2n);
    assert(vaultTokenAccountInfo.amount === investAmount * 2n);
  });
});
