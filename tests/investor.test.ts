import * as anchor from '@coral-xyz/anchor';
import type { Hackathon } from '../target/types/hackathon';
import { PublicKey } from '@solana/web3.js';
import { createMint, getAccount } from '@solana/spl-token';
import { airdropSol } from './utils';
import { BN } from 'bn.js';

describe('Investor', () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  let tokenPublicKey: anchor.web3.PublicKey;
  const program = anchor.workspace.Hackathon as anchor.Program<Hackathon>;
  const caller = anchor.web3.Keypair.generate();

  const [investorPubKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('investor'), caller.publicKey.toBuffer()],
    program.programId
  );

  const [investorTokenAccount] = PublicKey.findProgramAddressSync(
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

  it('should be able to create an investor', async () => {
    await program.methods
      .createInvestor('Nicholas')
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccount,
        owner: caller.publicKey,
        payer: caller.publicKey,
        mint: tokenPublicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));
  });

  it('Should be able to deposit', async () => {
    await program.methods
      .depositTokens(new BN(20))
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccount,
        owner: caller.publicKey,
        payer: caller.publicKey,
        mint: tokenPublicKey,
      })
      .signers([caller])
      .rpc()
      .catch((e) => console.log(e));

    const userTokenAccount = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccount
    );
  });
});
