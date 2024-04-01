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

describe("Originator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  let tokenPublicKey: anchor.web3.PublicKey;
  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();
  let token: PublicKey;

  const [originatorPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("originator"), caller.publicKey.toBuffer()],
    program.programId
  );

  const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("originator_token_account"),
      originatorPubKey.toBuffer(),
    ],
    program.programId
  );

  beforeAll(async () => {
    await airdropSol(caller.publicKey, 1);

    tokenPublicKey = await createMint(
      anchor.getProvider().connection,
      caller,
      caller.publicKey,
      caller.publicKey,
      9
    );
  });

  it("should be able to become an originator", async () => {
    await program.methods
      .createOriginator("Test", "description", "test")
      .accounts({
        originator: originatorPubKey,
        originatorTokenAccount: originatorTokenAccountPubKey,
        stableCoin: tokenPublicKey,
        payer: caller.publicKey,
        caller: caller.publicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const originatorInfo = await program.account.originator.fetch(
      originatorPubKey
    );

    const originatorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      originatorTokenAccountPubKey
    );

    expect(originatorInfo).not.to.be.undefined;
    expect(originatorInfo).not.to.be.null;
    expect(originatorInfo.name).to.equal("Test");
    expect(originatorInfo.description).to.equal("description");

    expect(originatorTokenAccountInfo).not.to.be.undefined;
    expect(originatorTokenAccountInfo).not.to.be.null;
    expect(parseFloat(originatorTokenAccountInfo.amount.toString())).to.equal(
      0
    );
  });

  it("should be able to edit an originator", async () => {
    await program.methods
      .editOriginator("Test 2", "description 2")
      .accounts({
        originator: originatorPubKey,
        payer: caller.publicKey,
        caller: caller.publicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const originatorInfo = await program.account.originator.fetch(
      originatorPubKey
    );

    expect(originatorInfo).not.to.be.undefined;
    expect(originatorInfo).not.to.be.null;
    expect(originatorInfo.name).to.equal("Test 2");
    expect(originatorInfo.description).to.equal("description 2");
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
      originatorTokenAccountPubKey,
      caller,
      100
    );

    const [originatorTokenAccount, receiverTokenAccount] = await Promise.all([
      getAccount(anchor.getProvider().connection, originatorTokenAccountPubKey),
      getAccount(anchor.getProvider().connection, receiverTokenAccountPubKey),
    ]);

    expect(originatorTokenAccount.amount).to.equal(100n);
    expect(receiverTokenAccount.amount).to.equal(0n);

    const tx = await program.methods
      .withdrawOriginatorTokens(new BN(10))
      .accounts({
        caller: caller.publicKey,
        payer: caller.publicKey,
        toTokenAccount: receiverTokenAccountPubKey,
        originator: originatorPubKey,
        originatorTokenAccount: originatorTokenAccountPubKey,
        stableToken: token,
      })
      .signers([caller])
      .rpc({ commitment: "processed" })
      .catch((error) => {
        console.log(error);
        expect(false).to.equal(true);
      });

    const [originatorTokenAccountAfter, receiverTokenAccountAfter] =
      await Promise.all([
        getAccount(
          anchor.getProvider().connection,
          originatorTokenAccountPubKey
        ),
        getAccount(anchor.getProvider().connection, receiverTokenAccountPubKey),
      ]);

    expect(originatorTokenAccountAfter.amount).to.equal(90n);
    expect(receiverTokenAccountAfter.amount).to.equal(10n);
  });
});
