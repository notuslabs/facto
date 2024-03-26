import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import { AnchorError, BN } from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { nanoid } from "nanoid";
import { PublicKey } from "@solana/web3.js";
import { createMint, mintTo, getAccount, getOrCreateAssociatedTokenAccount, Account } from "@solana/spl-token";
import { expect } from "chai";

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
  const callerOriginator = anchor.web3.Keypair.generate();
  const callerOriginator2 = anchor.web3.Keypair.generate();
  const callerInvestor = anchor.web3.Keypair.generate();
  const factoOwner = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();

  const [originator] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("originator"), callerOriginator.publicKey.toBuffer()],
    program.programId
  );
  const [originator2] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("originator"), callerOriginator2.publicKey.toBuffer()],
    program.programId
  );
  const [investor] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("investor"), callerInvestor.publicKey.toBuffer()],
    program.programId
  );
  const offerId = nanoid(16);
  const [offer] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("offer"),
      anchor.utils.bytes.utf8.encode(offerId)
    ],
    program.programId
  );
  const offerId2 = nanoid(17);
  const [offer2] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("offer"),
      anchor.utils.bytes.utf8.encode(offerId2)
    ],
    program.programId
  );
  let stableTokenPubKey: PublicKey;
  let investorTokenAccountPubKey: PublicKey;
  let externalStableOriginatorTokenAccount: Account
  
  before(async () => {
    await airdropSol(payer.publicKey, 30);
    
    stableTokenPubKey = await createMint(
      anchor.getProvider().connection,
      payer,
      factoOwner.publicKey,
      factoOwner.publicKey,
      9
    );
    externalStableOriginatorTokenAccount = await getOrCreateAssociatedTokenAccount(anchor.getProvider().connection, payer, stableTokenPubKey, callerOriginator.publicKey)

    await program.methods
      .createOriginator("test", "description")
      .accounts({
        originator,
        caller: callerOriginator.publicKey,
        payer: payer.publicKey,
      })
      .signers([callerOriginator, payer])
      .rpc();

    await program.methods
      .createOriginator("test 2", "description 2")
      .accounts({
        originator: originator2,
        caller: callerOriginator2.publicKey,
        payer: payer.publicKey,
      })
      .signers([callerOriginator2, payer])
      .rpc();

    [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("investor_token_account"),
        investor.toBuffer(),
      ],
      program.programId
    );
    
    console.log("CREATE INVESTOR")
    await program.methods
      .createInvestor("Investidor 1")
      .accounts({
        investor,
        investorTokenAccount: investorTokenAccountPubKey,
        caller: callerInvestor.publicKey,
        payer: payer.publicKey,
        stableCoin: stableTokenPubKey,
      })
      .signers([payer, callerInvestor])
      .rpc()
      .catch(console.error);
  });

  it("should be able to create an offer", async () => {
    const [tokenPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
      program.programId
    );
    const [tokenPubKey2] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_token"), offer2.toBuffer()],
      program.programId
    );
    const [vaultPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
      program.programId
    );

    const [vaultPubKey2] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer2.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .createOffer(
        offerId,
        "Offer Name",
        "Offer Description",
        new BN(Date.now()),
        new BN(100),
        new BN(50),
        1.5,
        3,
        null
      )
      .accounts({
        caller: callerOriginator.publicKey,
        originator,
        payer: payer.publicKey,
        offer,
        token: tokenPubKey,
        stableToken: stableTokenPubKey,
        vault: vaultPubKey,
      })
      .signers([payer, callerOriginator])
      .rpc()
      .catch((e) => console.error(e));

    await program.methods
      .createOffer(
        offerId2,
        "Offer Name 2",
        "Offer Description 2",
        new BN(1664996800),
        new BN(100),
        new BN(50),
        1.5,
        3,
        null
      )
      .accounts({
        caller: callerOriginator2.publicKey,
        originator: originator2,
        payer: payer.publicKey,
        offer: offer2,
        token: tokenPubKey2,
        stableToken: stableTokenPubKey,
        vault: vaultPubKey2,
      })
      .signers([payer, callerOriginator2])
      .rpc()
      .catch((e) => console.error("ERROR NA CRIAÇÂO DA OFFER 2", e));

    const mint = await getAccount(anchor.getProvider().connection, vaultPubKey);
  });

  it("should be able to deposit in the offer", async () => {
    const investAmount = 50n;

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
      program.programId
    );

    await mintTo(
      anchor.getProvider().connection,
      payer,
      stableTokenPubKey,
      investorTokenAccountPubKey,
      factoOwner,
      100
    ).catch(console.error);

    const initialInvestorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    const [offerTokenPublicKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
      program.programId
    );

    const [investorOfferTokenAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("investor_offer_token_account"),
        investor.toBuffer(),
      ],
      program.programId
    );

    try {
      await program.methods
        .invest(new anchor.BN("49"))
        .accounts({
          vaultTokenAccount,
          caller: callerInvestor.publicKey,
          investorOfferTokenAccount,
          investorTokenAccount: investorTokenAccountPubKey,
          payer: payer.publicKey,
          offerToken: offerTokenPublicKey,
          offer,
          investor,
        })
        .signers([payer, callerInvestor])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        "Min amount required"
      );
    }

    try {
      await program.methods
        .invest(new anchor.BN("101"))
        .accounts({
          vaultTokenAccount,
          caller: callerInvestor.publicKey,
          investorOfferTokenAccount,
          investorTokenAccount: investorTokenAccountPubKey,
          payer: payer.publicKey,
          offerToken: offerTokenPublicKey,
          offer,
          investor,
        })
        .signers([payer, callerInvestor])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        "Goal amount exceeded"
      );
    }

    const tx1 = await program.methods
      .invest(new anchor.BN(investAmount.toString()))
      .accounts({
        vaultTokenAccount,
        caller: callerInvestor.publicKey,
        investorOfferTokenAccount,
        investorTokenAccount: investorTokenAccountPubKey,
        payer: payer.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
        investor,
      })
      .signers([payer, callerInvestor])
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

    let investorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    expect(
      initialInvestorTokenAccountInfo.amount - investAmount ===
        investorTokenAccountInfo.amount
    ).true;
    expect(investorOfferTokenAccountInfo.amount === investAmount).true;
    expect(vaultTokenAccountInfo.amount === investAmount).true;

    await program.methods
      .invest(new anchor.BN(investAmount.toString()))
      .accounts({
        vaultTokenAccount,
        caller: callerInvestor.publicKey,
        investorOfferTokenAccount,
        investorTokenAccount: investorTokenAccountPubKey,
        payer: payer.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
        investor,
      })
      .signers([payer, callerInvestor])
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

    investorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    expect(investorOfferTokenAccountInfo.amount === investAmount * 2n).true;
    expect(vaultTokenAccountInfo.amount === investAmount * 2n).true;
    expect(
      initialInvestorTokenAccountInfo.amount - investAmount * 2n ===
        investorTokenAccountInfo.amount
    ).true;
  });

  it("should be able originator withdraw balance of the vault", async () => {
    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
      program.programId
      );

      const [vaultPubKey2] = PublicKey.findProgramAddressSync(
        [anchor.utils.bytes.utf8.encode("offer_vault"), offer2.toBuffer()],
        program.programId
      );

    await program.methods
      .withdrawInvestments()
      .accounts({
        vaultTokenAccount: vaultTokenAccount,
        originatorStableTokenAccount: externalStableOriginatorTokenAccount.address,
        offer: offer,
        payer: payer.publicKey,
        originator: originator,
        caller: callerOriginator.publicKey
      })
      .signers([payer, callerOriginator])
      .rpc().then(_=> expect(true).true)
      .catch(err => {
        console.error(err)
        expect(false).true
      });

    expect((await getAccount(anchor.getProvider().connection, externalStableOriginatorTokenAccount.address)).amount === 100n)
  });
});
