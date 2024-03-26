use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

#[account]
pub struct Investor {
    pub name: String,
    pub bump: u8,
}

#[account]
pub struct Empty {}

impl Investor {
    const LENGTH: usize = 8 + 4 + 32 + 32; // default length + (string prefix length + investor name length) + caller pubkey length
}

#[derive(Accounts)]
pub struct CreateInvestor<'info> {
    #[account(init, payer = payer, space = Investor::LENGTH, seeds = [b"investor", caller.key().as_ref()], bump)]
    pub investor: Account<'info, Investor>,
    #[account(
        init,
        payer = payer, 
        token::mint = mint,
        token::authority = investor,
        seeds = [b"investor_token_account", investor.key().as_ref()],
        bump
    )]
    pub investor_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositTokens<'info> {
    pub investor: Account<'info, Investor>,
    #[account(
        mut,
        token::mint = mint,
        token::authority = investor,
        seeds = [b"investor_token_account", investor.key().as_ref()],
        bump
    )]
    pub investor_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub caller: Signer<'info>, // caller of the token account
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    pub investor: Account<'info, Investor>,
    #[account(
        mut,
        token::mint = mint,
        token::authority = investor,
        seeds = [b"investor_token_account", investor.key().as_ref()],
        bump
    )]
    pub investor_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = mint,
        token::authority = caller,
    )]
    pub to_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub caller: Signer<'info>, // caller of the token account
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}   