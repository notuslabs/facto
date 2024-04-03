use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[account]
#[derive(InitSpace)]
pub struct Originator {
    #[max_len(30)]
    pub name: String,
    #[max_len(500)]
    pub description: String,
    pub total_offers: u32,
    #[max_len(30)]
    pub token_slug: String,
    pub bump: u8,
    pub token_account_bump: u8,
}

#[derive(Accounts)]
pub struct CreateOriginator<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(init, payer = payer, space = Originator::INIT_SPACE, seeds = [b"originator", caller.key().as_ref()], bump)]
    pub originator: Account<'info, Originator>,
    #[account(
        init,
        payer = payer, 
        token::mint = stable_coin,
        token::authority = originator,
        seeds = [b"originator_token_account", originator.key().as_ref()],
        bump
    )]
    pub originator_token_account: Account<'info, TokenAccount>,
    #[account(mut, mint::decimals = 6)] // TODO: add stable coin constraint
    pub stable_coin: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EditOriginator<'info> {
    #[account(
        mut,
        seeds = [b"originator", caller.key().as_ref()],
        bump=originator.bump
    )]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawOriginatorTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds = [b"originator", caller.key().as_ref()], bump=originator.bump)]
    pub originator: Account<'info, Originator>,
    #[account(mut, seeds = [b"originator_token_account", originator.key().as_ref()], bump=originator.token_account_bump)]
    pub originator_token_account: Account<'info, TokenAccount>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint to stable token
    pub stable_token: Account<'info, Mint>,

    #[account(mut, token::mint = stable_token)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
