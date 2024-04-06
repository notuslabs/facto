import * as anchor from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { PublicKey } from "@solana/web3.js";
import { airdropSol } from "./utils";
import { expect } from "chai";
import { BN } from "bn.js";
import {
  createMint,
  getAccount,
  mintTo,
  createAccount,
} from "@solana/spl-token";

describe("Borrower", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();
  let token: PublicKey;

  const [borrowerPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("borrower"), caller.publicKey.toBuffer()],
    program.programId
  );

  const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("borrower_token_account"),
      borrowerPubKey.toBuffer(),
    ],
    program.programId
  );

  beforeAll(async () => {
    await airdropSol(caller.publicKey, 1);

    token = await createMint(
      anchor.getProvider().connection,
      caller,
      caller.publicKey,
      caller.publicKey,
      6
    );
  });

  it("should be able to become an borrower", async () => {
    await program.methods
      .createBorrower("Test", "description", "test")
      .accounts({
        borrower: borrowerPubKey,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        stableCoin: token,
        payer: caller.publicKey,
        caller: caller.publicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const borrowerInfo = await program.account.borrower.fetch(borrowerPubKey);

    const borrowerTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      borrowerTokenAccountPubKey
    );

    expect(borrowerInfo).not.to.be.undefined;
    expect(borrowerInfo).not.to.be.null;
    expect(borrowerInfo.name).to.equal("Test");
    expect(borrowerInfo.description).to.equal("description");

    expect(borrowerTokenAccountInfo).not.to.be.undefined;
    expect(borrowerTokenAccountInfo).not.to.be.null;
    expect(parseFloat(borrowerTokenAccountInfo.amount.toString())).to.equal(0);
  });

  it("should be able to edit an borrower", async () => {
    await program.methods
      .editBorrower("Test 2", "description 2")
      .accounts({
        borrower: borrowerPubKey,
        payer: caller.publicKey,
        caller: caller.publicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const borrowerInfo = await program.account.borrower.fetch(borrowerPubKey);

    expect(borrowerInfo).not.to.be.undefined;
    expect(borrowerInfo).not.to.be.null;
    expect(borrowerInfo.name).to.equal("Test 2");
    expect(borrowerInfo.description).to.equal("description 2");
  });

  it("should be able to withdraw all tokens", async () => {
    const receiverTokenAccountPubKey = await createAccount(
      anchor.getProvider().connection,
      caller,
      token,
      caller.publicKey
    );

    await mintTo(
      anchor.getProvider().connection,
      caller,
      token,
      borrowerTokenAccountPubKey,
      caller,
      100
    );

    const [borrowerTokenAccount, receiverTokenAccount] = await Promise.all([
      getAccount(anchor.getProvider().connection, borrowerTokenAccountPubKey),
      getAccount(anchor.getProvider().connection, receiverTokenAccountPubKey),
    ]);

    expect(borrowerTokenAccount.amount).to.equal(100n);
    expect(receiverTokenAccount.amount).to.equal(0n);

    const tx = await program.methods
      .withdrawBorrowerTokens(new BN(10))
      .accounts({
        caller: caller.publicKey,
        payer: caller.publicKey,
        toTokenAccount: receiverTokenAccountPubKey,
        borrower: borrowerPubKey,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        stableToken: token,
      })
      .signers([caller])
      .rpc({ commitment: "processed" })
      .catch((error) => {
        console.log(error);
        expect(false).to.equal(true);
      });

    const [borrowerTokenAccountAfter, receiverTokenAccountAfter] =
      await Promise.all([
        getAccount(anchor.getProvider().connection, borrowerTokenAccountPubKey),
        getAccount(anchor.getProvider().connection, receiverTokenAccountPubKey),
      ]);

    expect(borrowerTokenAccountAfter.amount).to.equal(90n);
    expect(receiverTokenAccountAfter.amount).to.equal(10n);
  });
});
