import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import { AnchorError, BN } from '@coral-xyz/anchor';
import type { Hackathon } from '../target/types/hackathon';
import { nanoid } from 'nanoid';
import { PublicKey } from '@solana/web3.js';
import { createMint, mintTo, getAccount } from '@solana/spl-token';
import { advanceTime } from './utils';

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

describe('Offer', { timeout: 500000 }, () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Hackathon as Program<Hackathon>;
  const callerBorrower = anchor.web3.Keypair.generate();
  const callerBorrower2 = anchor.web3.Keypair.generate();
  const callerInvestor = anchor.web3.Keypair.generate();
  const factoOwner = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  const deadline = Math.floor(Date.now() / 1000 + 10);
  const installmentsStartDate = deadline + 10;
  const now = Date.now() / 1000 + 5;

  const goalAmount = 100;
  const installmentsTotalAmount = 150;
  const installmentsTotal = 2;

  const [borrower] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('borrower'),
      callerBorrower.publicKey.toBuffer(),
    ],
    program.programId
  );
  const [borrower2] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('borrower'),
      callerBorrower2.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [investor] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('investor'),
      callerInvestor.publicKey.toBuffer(),
    ],
    program.programId
  );
  const offerId = nanoid(16);
  const [offer] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('offer'),
      anchor.utils.bytes.utf8.encode(offerId),
    ],
    program.programId
  );
  const offerId2 = nanoid(16);
  console.log(offerId2, offerId2.length);
  const [offer2] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('offer'),
      anchor.utils.bytes.utf8.encode(offerId2),
    ],
    program.programId
  );
  const [offerTokenPublicKey] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('offer_token'), offer.toBuffer()],
    program.programId
  );
  const [vaultPaymentTokenAccount] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('vault_payment_token_account'),
      offer.toBuffer(),
    ],
    program.programId
  );
  const [vaultPaymentTokenAccount2] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('vault_payment_token_account'),
      offer2.toBuffer(),
    ],
    program.programId
  );
  const [investorOfferTokenAccount] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('investor_offer_token_account'),
      offer.toBuffer(),
      investor.toBuffer(),
    ],
    program.programId
  );
  const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('borrower_token_account'),
      borrower.toBuffer(),
    ],
    program.programId
  );
  const [borrowerTokenAccountPubKey2] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('borrower_token_account'),
      borrower2.toBuffer(),
    ],
    program.programId
  );

  let stableTokenPubKey: PublicKey;
  let investorTokenAccountPubKey: PublicKey;

  beforeAll(async () => {
    await airdropSol(payer.publicKey, 30);

    stableTokenPubKey = await createMint(
      anchor.getProvider().connection,
      payer,
      factoOwner.publicKey,
      factoOwner.publicKey,
      9
    );

    await program.methods
      .createBorrower('test', 'description', 'teste')
      .accounts({
        borrower,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        stableCoin: stableTokenPubKey,
        caller: callerBorrower.publicKey,
        payer: payer.publicKey,
      })
      .signers([callerBorrower, payer])
      .rpc();

    await program.methods
      .createBorrower('test 2', 'description 2', 'test')
      .accounts({
        borrower: borrower2,
        borrowerTokenAccount: borrowerTokenAccountPubKey2,
        stableCoin: stableTokenPubKey,
        caller: callerBorrower2.publicKey,
        payer: payer.publicKey,
      })
      .signers([callerBorrower2, payer])
      .rpc();

    [investorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('investor_stable_token_account'),
        investor.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .createInvestor('Investidor 1')
      .accounts({
        investor,
        investorStableTokenAccount: investorTokenAccountPubKey,
        caller: callerInvestor.publicKey,
        payer: payer.publicKey,
        stableCoin: stableTokenPubKey,
      })
      .signers([payer, callerInvestor])
      .rpc();
  });

  it('should be able to create an offer', async () => {
    const [tokenPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_token'), offer.toBuffer()],
      program.programId
    );
    const [tokenPubKey2] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_token'), offer2.toBuffer()],
      program.programId
    );
    const [vaultPubKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_vault'), offer.toBuffer()],
      program.programId
    );

    const [vaultPubKey2] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_vault'), offer2.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .createOffer(
        offerId,
        'Offer Description',
        new BN(deadline),
        new BN(goalAmount),
        new BN(now),
        new BN(50),
        2,
        new BN(installmentsTotalAmount),
        new BN(installmentsStartDate)
      )
      .accounts({
        caller: callerBorrower.publicKey,
        borrower,
        payer: payer.publicKey,
        offer,
        token: tokenPubKey,
        stableToken: stableTokenPubKey,
        vault: vaultPubKey,
      })
      .signers([payer, callerBorrower])
      .rpc()
      .catch(console.error);

    await program.methods
      .createOffer(
        offerId2,
        'Offer Description',
        new BN(deadline),
        new BN(100),
        new BN(now),
        new BN(50),
        3,
        new BN(installmentsTotalAmount),
        new BN(installmentsStartDate)
      )
      .accounts({
        caller: callerBorrower2.publicKey,
        borrower: borrower2,
        payer: payer.publicKey,
        offer: offer2,
        token: tokenPubKey2,
        stableToken: stableTokenPubKey,
        vault: vaultPubKey2,
      })
      .signers([callerBorrower2, payer])
      .rpc({ commitment: 'processed' });

    const offerAccount = await program.account.offer.fetch(offer);

    expect(offerAccount).to.containSubset({
      id: offerId,
      description: 'Offer Description',
      discriminator: 0,
      goalAmount: new BN(goalAmount),
      borrower,
      installmentsCount: installmentsTotal,
      installmentsTotalAmount: new BN(installmentsTotalAmount),
      installmentsNextPaymentDate: new BN(installmentsStartDate),
      minAmountInvest: new BN(50),
      startDate: new BN(now),
    });
    expect(offerAccount.deadlineDate.toString()).to.equal(deadline.toString());
  });

  it('should be able to deposit in the offer', async () => {
    const investAmount = 50n;

    const [vaultStableTokenAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_vault'), offer.toBuffer()],
      program.programId
    );

    await mintTo(
      anchor.getProvider().connection,
      payer,
      stableTokenPubKey,
      investorTokenAccountPubKey,
      factoOwner,
      100
    );

    const initialInvestorTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorTokenAccountPubKey
    );

    try {
      await program.methods
        .invest(offerId, new anchor.BN('49'))
        .accounts({
          vaultStableTokenAccount,
          caller: callerInvestor.publicKey,
          investorOfferTokenAccount,
          investorStableTokenAccount: investorTokenAccountPubKey,
          payer: payer.publicKey,
          offerToken: offerTokenPublicKey,
          offer,
          investor,
          stableToken: stableTokenPubKey,
        })
        .signers([payer, callerInvestor])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'Investment amount must be greater than offer min amount'
      );
    }

    try {
      await program.methods
        .invest(offerId, new anchor.BN('101'))
        .accounts({
          vaultStableTokenAccount,
          caller: callerInvestor.publicKey,
          investorOfferTokenAccount,
          investorStableTokenAccount: investorTokenAccountPubKey,
          payer: payer.publicKey,
          offerToken: offerTokenPublicKey,
          offer,
          investor,
          stableToken: stableTokenPubKey,
        })
        .signers([payer, callerInvestor])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'Investment exceeds goal amount'
      );
    }

    await advanceTime<Hackathon>(program, now + 2);

    await program.methods
      .invest(offerId, new anchor.BN(investAmount.toString()))
      .accounts({
        vaultStableTokenAccount,
        caller: callerInvestor.publicKey,
        investorOfferTokenAccount,
        investorStableTokenAccount: investorTokenAccountPubKey,
        payer: payer.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
        investor,
        stableToken: stableTokenPubKey,
      })
      .signers([payer, callerInvestor])
      .rpc();

    let investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    let vaultTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      vaultStableTokenAccount
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
      .invest(offerId, new anchor.BN(investAmount.toString()))
      .accounts({
        vaultStableTokenAccount,
        caller: callerInvestor.publicKey,
        investorOfferTokenAccount,
        investorStableTokenAccount: investorTokenAccountPubKey,
        payer: payer.publicKey,
        offerToken: offerTokenPublicKey,
        offer,
        investor,
        stableToken: stableTokenPubKey,
      })
      .signers([payer, callerInvestor])
      .rpc();

    investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    vaultTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      vaultStableTokenAccount
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

  it('should be able borrower withdraw balance of the vault', async () => {
    const [vaultStableTokenAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_vault'), offer.toBuffer()],
      program.programId
    );

    const [vaultPubKey2] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('offer_vault'), offer2.toBuffer()],
      program.programId
    );

    await advanceTime<Hackathon>(program, deadline);

    await program.methods
      .withdrawInvestments(offerId)
      .accounts({
        vaultStableTokenAccount,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        offer: offer,
        payer: payer.publicKey,
        borrower: borrower,
        caller: callerBorrower.publicKey,
        stableToken: stableTokenPubKey,
      })
      .signers([payer, callerBorrower])
      .rpc();

    expect(
      (
        await getAccount(
          anchor.getProvider().connection,
          borrowerTokenAccountPubKey
        )
      ).amount === BigInt(goalAmount)
    ).true;
  });

  it('should be able borrower pay first installment', async () => {
    try {
      await program.methods
        .payInstallment(offerId)
        .accounts({
          payer: payer.publicKey,
          caller: callerBorrower.publicKey,
          offer,
          borrower,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          stableToken: stableTokenPubKey,
          vaultPaymentTokenAccount,
        })
        .signers([payer, callerBorrower])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'The Offer is not on track'
      );
    }

    await advanceTime(program, installmentsStartDate);

    await program.methods
      .payInstallment(offerId)
      .accounts({
        payer: payer.publicKey,
        caller: callerBorrower.publicKey,
        offer,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        borrower,
        vaultPaymentTokenAccount,
        stableToken: stableTokenPubKey,
      })
      .signers([payer, callerBorrower])
      .rpc();

    let borrowerTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      borrowerTokenAccountPubKey
    );
    const installmentAmount = installmentsTotalAmount / installmentsTotal;
    let _offer = await program.account.offer.fetch(offer.toString());

    expect(
      borrowerTokenAccountInfo.amount.toString() ===
        (goalAmount - installmentAmount).toString()
    ).true;
    expect(_offer.totalInstallmentsPaid === 1).true;
  });

  it('should investor withdraw your first installment', async () => {
    const [investorInstallment] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('investor_installment'),
        offer.toBuffer(),
        investor.toBuffer(),
      ],
      program.programId
    );

    let investorOfferTokenAccountInitial = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    await program.methods
      .withdrawInstallment(offerId)
      .accounts({
        payer: payer.publicKey,
        ownerInvestor: callerInvestor.publicKey,
        investorInstallment,
        investor,
        investorOfferTokenAccount,
        investorStableTokenAccount: investorTokenAccountPubKey,
        vaultPaymentTokenAccount,
        offerToken: offerTokenPublicKey,
        offer,
        stableToken: stableTokenPubKey,
      })
      .signers([payer])
      .rpc();

    let investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    expect(
      investorOfferTokenAccountInitial.amount - 50n ===
        investorOfferTokenAccountInfo.amount
    ).true;

    try {
      await program.methods
        .withdrawInstallment(offerId)
        .accounts({
          payer: payer.publicKey,
          ownerInvestor: callerInvestor.publicKey,
          investorInstallment,
          investor,
          investorOfferTokenAccount,
          investorStableTokenAccount: investorTokenAccountPubKey,
          vaultPaymentTokenAccount,
          offerToken: offerTokenPublicKey,
          offer,
          stableToken: stableTokenPubKey,
        })
        .signers([payer])
        .rpc();
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'Investor has no installment to receive'
      );
    }
  });

  it('should be able borrower pay last installment', async () => {
    await mintTo(
      anchor.getProvider().connection,
      payer,
      stableTokenPubKey,
      borrowerTokenAccountPubKey,
      factoOwner,
      50
    );

    await program.methods
      .payInstallment(offerId)
      .accounts({
        payer: payer.publicKey,
        caller: callerBorrower.publicKey,
        offer,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        vaultPaymentTokenAccount,
        stableToken: stableTokenPubKey,
      })
      .signers([payer, callerBorrower])
      .rpc();

    const _offer = await program.account.offer.fetch(offer.toString());

    const borrowerTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      borrowerTokenAccountPubKey
    );

    expect(_offer.totalInstallmentsPaid === 2, 'total paid').true;
    expect(borrowerTokenAccountInfo.amount.toString() === '0').true;

    try {
      await program.methods
        .payInstallment(offerId)
        .accounts({
          payer: payer.publicKey,
          caller: callerBorrower.publicKey,
          offer,
          borrowerTokenAccount: borrowerTokenAccountPubKey,
          vaultPaymentTokenAccount,
          stableToken: stableTokenPubKey,
        })
        .signers([payer, callerBorrower])
        .rpc();

      expect(false, "should've failed but didn't ").true;
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'The Offer is not on track'
      );
    }
  });

  it('should investor withdraw your last installment', async () => {
    const [investorInstallment] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('investor_installment'),
        offer.toBuffer(),
        investor.toBuffer(),
      ],
      program.programId
    );

    const investorOfferTokenAccountInitial = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );

    await program.methods
      .withdrawInstallment(offerId)
      .accounts({
        payer: payer.publicKey,
        ownerInvestor: callerInvestor.publicKey,
        investorInstallment,
        investor,
        investorOfferTokenAccount,
        investorStableTokenAccount: investorTokenAccountPubKey,
        vaultPaymentTokenAccount,
        offerToken: offerTokenPublicKey,
        offer,
        stableToken: stableTokenPubKey,
      })
      .signers([payer])
      .rpc();

    const investorOfferTokenAccountInfo = await getAccount(
      anchor.getProvider().connection,
      investorOfferTokenAccount
    );
    expect(
      investorOfferTokenAccountInitial.amount - 50n ===
        investorOfferTokenAccountInfo.amount
    ).true;

    try {
      await program.methods
        .withdrawInstallment(offerId)
        .accounts({
          payer: payer.publicKey,
          ownerInvestor: callerInvestor.publicKey,
          investorInstallment,
          investor,
          investorOfferTokenAccount,
          investorStableTokenAccount: investorTokenAccountPubKey,
          vaultPaymentTokenAccount,
          offerToken: offerTokenPublicKey,
          offer,
          stableToken: stableTokenPubKey,
        })
        .signers([payer])
        .rpc();
    } catch (err) {
      expect(err).to.be.instanceOf(AnchorError);
      expect((err as AnchorError).error.errorMessage).to.equal(
        'Investor has no installment to receive'
      );
    }
  });
});
