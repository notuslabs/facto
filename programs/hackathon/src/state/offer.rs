use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::Originator;

#[derive(Clone, AnchorDeserialize, AnchorSerialize, InitSpace)]
pub enum OfferStatus {
    Open,
    Failed,
    Funded,
    OnTrack,
    Finished,
}

#[derive(Clone, AnchorDeserialize, AnchorSerialize, InitSpace)]
pub enum CreditScore {
    AAA,
    AA,
    A,
    BBB,
    BB,
    B,
    CCC,
    CC,
    C,
    DDD,
    DD,
    D,
}

#[account]
#[derive(InitSpace)]
pub struct Offer {
    #[max_len(16)]
    pub id: String,
    #[max_len(100)]
    pub name: String,
    #[max_len(500)]
    pub description: String,
    pub interest_rate_percent: f32,
    pub deadline_date: u64,
    pub goal_amount: f32,
    pub start_date: Option<u64>,
    pub status: OfferStatus,
    pub installments_total: u8,
    pub installments_paid: u8,
    pub installment_amount: f32,
    pub installments_start_date: Option<u64>,
    pub credit_score: CreditScore,
    pub created_at: i64,
    pub bump: u8,
    pub token_bump: u8,
    pub vault_bump: u8,
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct CreateOffer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds = [b"originator", caller.key().as_ref()], bump = originator.bump)]
    pub originator: Box<Account<'info, Originator>>,
    #[account(init, payer = payer, space = Offer::INIT_SPACE, seeds = [b"offer", id.as_bytes()], bump)]
    pub offer: Box<Account<'info, Offer>>,
    #[account(
        init,
        seeds = [b"offer_token", offer.key().as_ref()],
        bump,
        payer = payer,
        mint::authority = offer,
        mint::decimals = 9,
    )]
    pub token: Box<Account<'info, Mint>>,

    #[account()] // TODO: add constraint to ensure that the token is a stablecoin
    pub stable_token: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [b"offer_vault", offer.key().as_ref()],
        bump,
        payer = payer,
        token::mint = stable_token,
        token::authority = offer
      )]
    pub vault: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct WithdrawInvestments<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
