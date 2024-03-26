import * as anchor from '@coral-xyz/anchor';
import type { Hackathon } from '../target/types/hackathon';
import { PublicKey } from '@solana/web3.js';
import { airdropSol } from './utils';
import { expect } from 'chai';
import { createMint, getAccount } from '@solana/spl-token';

describe('Originator', () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  let tokenPublicKey: anchor.web3.PublicKey;
  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();

  const [originatorPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('originator'), caller.publicKey.toBuffer()],
    program.programId
  );

  const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('originator_token_account'),
      originatorPubKey.toBuffer(),
    ],
    program.programId
  );

  before(async () => {
    await airdropSol(caller.publicKey, 1);

    tokenPublicKey = await createMint(
      anchor.getProvider().connection,
      caller,
      caller.publicKey,
      caller.publicKey,
      9
    );
  });

  it('should be able to become an originator', async () => {
    await program.methods
      .createOriginator('Test', 'description')
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
    expect(originatorInfo.name).to.equal('Test');
    expect(originatorInfo.description).to.equal('description');

    expect(originatorTokenAccountInfo).not.to.be.undefined;
    expect(originatorTokenAccountInfo).not.to.be.null;
    expect(parseFloat(originatorTokenAccountInfo.amount.toString())).to.equal(
      0
    );
  });

  it('should be able to edit an originator', async () => {
    await program.methods
      .editOriginator('Test 2', 'description 2')
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
    expect(originatorInfo.name).to.equal('Test 2');
    expect(originatorInfo.description).to.equal('description 2');
  });
});
