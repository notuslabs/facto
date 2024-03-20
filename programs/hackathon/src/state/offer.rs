use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use anchor_spl::associated_token::AssociatedToken;

use crate::Originator;

#[account]
pub struct Offer {
    pub title: String,
    pub owner: Pubkey,
    pub bump: u8,
}

impl Offer {
    const LENGTH: usize = 8 + 4 + 140 + 32 + 1; // default length + (string prefix length + 140 title content) + originator pubkey length + bump length
}

#[account]
pub struct Empty {}

#[derive(Accounts)]
pub struct CreateOffer<'info> {
    // spl token stuff
    #[account(init, payer = payer, space = 8)]
    pub token_account_authority: Account<'info, Empty>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = token_account_authority
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"originator", owner.key().as_ref()], bump = originator.bump)] 
    pub originator: Account<'info, Originator>,

    // offer stuff
    #[account(init, payer = payer, space = Offer::LENGTH, seeds = [b"offer", originator.key().as_ref()], bump)]
    pub offer: Account<'info, Offer>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawInvestments<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account_authority: Account<'info, Empty>,
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub destination: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}