import * as anchor from '@coral-xyz/anchor';
import type { Hackathon } from '../target/types/hackathon';
import { PublicKey } from '@solana/web3.js';
import {
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { airdropSol } from './utils';
import { BN } from 'bn.js';
import { expect } from 'chai';

describe('Investor', () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  let tokenPublicKey: anchor.web3.PublicKey;
  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();

  const [investorPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('investor'), caller.publicKey.toBuffer()],
    program.programId
  );

  const [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('investor_token_account'),
      investorPubKey.toBuffer(),
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

  it('should be able to become an investor', async () => {
    await program.methods
      .createInvestor('Investor 1')
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccountPubKey,
        owner: caller.publicKey,
        payer: caller.publicKey,
        mint: tokenPublicKey,
      })
      .signers([caller])
      .rpc();

    const investorTokenAccount = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    const investorInfo = await program.account.investor.fetch(investorPubKey);

    expect(investorTokenAccount).not.to.be.undefined;
    expect(investorTokenAccount).not.to.be.null;
    expect(parseFloat(investorTokenAccount.amount.toString())).to.equal(0);
    expect(investorInfo.name).to.equal('Investor 1');
  });

  it('Should be able to edit the investor name', async () => {
    await program.methods
      .editInvestor('Investor 2')
      .accounts({
        investor: investorPubKey,
        owner: caller.publicKey,
        payer: caller.publicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const investorInfo = await program.account.investor.fetch(investorPubKey);

    expect(investorInfo.name).to.equal('Investor 2');
  });

  it('Should be able to deposit', async () => {
    await program.methods
      .depositTokens(new BN(20))
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccountPubKey,
        owner: caller.publicKey,
        payer: caller.publicKey,
        mint: tokenPublicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const investorTokenAccount = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    expect(parseFloat(investorTokenAccount.amount.toString())).to.equal(20);
  });

  it('Should be able to withdraw', async () => {
    let caller_token_account = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      caller,
      tokenPublicKey,
      caller.publicKey
    );

    let investorTokenAccount = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    await program.methods
      .withdrawTokens(new BN(20))
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccount.address,
        toTokenAccount: caller_token_account.address,
        owner: caller.publicKey,
        payer: caller.publicKey,
        mint: tokenPublicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    investorTokenAccount = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    caller_token_account = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      caller,
      tokenPublicKey,
      caller.publicKey
    );

    expect(parseFloat(investorTokenAccount.amount.toString())).to.equal(0);
    expect(parseFloat(caller_token_account.amount.toString())).to.equal(20);
  });
});
