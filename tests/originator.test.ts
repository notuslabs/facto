import * as anchor from "@coral-xyz/anchor";
import type { Hackathon } from "../target/types/hackathon";
import { PublicKey } from "@solana/web3.js";
import { airdropSol } from "./utils";
import { expect } from "chai";

describe("Originator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();

  const [originatorPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("originator"), caller.publicKey.toBuffer()],
    program.programId
  );

  before(async () => {
    await airdropSol(caller.publicKey, 1);
  });

  it("should be able to become an originator", async () => {
    await program.methods
      .createOriginator("Test", "description")
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
    expect(originatorInfo.name).to.equal("Test");
    expect(originatorInfo.description).to.equal("description");
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
});
