use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[account]
pub struct Offer {
    pub title: String,
    pub owner: Pubkey,
    pub bump: u8,
}

impl Offer {
    const LENGTH: usize = 8 + 4 + 140 + 32 + 1; // default length + (string prefix length + 140 title content) + originator pubkey length + bump length
}

#[derive(Accounts)]
pub struct CreateOffer<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = payer, space = Offer::LENGTH)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
