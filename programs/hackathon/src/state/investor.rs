use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

#[account]
#[derive(InitSpace)]
pub struct Investor {
    #[max_len(30)]
    pub name: String,
    pub bump: u8,
    pub token_account_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Investment {
    pub offer: Pubkey,
    pub investor: Pubkey,
    pub installments_received: Option<u8>,
    pub total_invested: u64,
    pub bump: u8
}

#[derive(Accounts)]
pub struct CreateInvestor<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(init, payer = payer, space = Investor::INIT_SPACE, seeds = [b"investor", caller.key().as_ref()], bump)]
    pub investor: Account<'info, Investor>,
    #[account(
        init,
        payer = payer, 
        token::mint = stable_coin,
        token::authority = investor,
        seeds = [b"investor_stable_token_account", investor.key().as_ref()],
        bump
    )]
    pub investor_stable_token_account: Account<'info, TokenAccount>,

    #[account(mut, mint::decimals = 6)]
    // TODO: Restrict the stable coin later
    pub stable_coin: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EditInvestor<'info> {
    #[account(mut, seeds = [b"investor", owner.key().as_ref()], bump = investor.bump)]
    pub investor: Account<'info, Investor>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub owner: Signer<'info>, // owner of the token account
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>, // caller of the token account

    #[account(mut, seeds = [b"investor", caller.key().as_ref()], bump = investor.bump)]
    pub investor: Account<'info, Investor>,
    #[account(
        mut,
        token::mint = stable_coin,
        token::authority = investor,
        seeds = [b"investor_stable_token_account", investor.key().as_ref()],
        bump = investor.token_account_bump
    )]
    pub investor_stable_token_account: Account<'info, TokenAccount>,

    #[account(mut, mint::decimals = 6)]
    // TODO: Restrict the stable coin later
    pub stable_coin: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>, // caller of the token account

    #[account(mut, seeds = [b"investor", caller.key().as_ref()], bump = investor.bump)]
    pub investor: Account<'info, Investor>,
    #[account(
        mut,
        token::mint = stable_coin,
        token::authority = investor,
        seeds = [b"investor_stable_token_account", investor.key().as_ref()],
        bump = investor.token_account_bump
    )]
    pub investor_stable_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = stable_coin,
    )]
    pub to_token_account: Account<'info, TokenAccount>,

    #[account(mut, mint::decimals = 6)]
    // TODO: Restrict the stable coin later
    pub stable_coin: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}   
