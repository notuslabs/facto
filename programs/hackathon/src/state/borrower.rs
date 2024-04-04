use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[account]
#[derive(InitSpace)]
pub struct Borrower {
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
pub struct CreateBorrower<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(init, payer = payer, space = Borrower::INIT_SPACE, seeds = [b"borrower", caller.key().as_ref()], bump)]
    pub borrower: Account<'info, Borrower>,
    #[account(
        init,
        payer = payer, 
        token::mint = stable_coin,
        token::authority = borrower,
        seeds = [b"borrower_token_account", borrower.key().as_ref()],
        bump
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut, mint::decimals = 6)] // TODO: add stable coin constraint
    pub stable_coin: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EditBorrower<'info> {
    #[account(
        mut,
        seeds = [b"borrower", caller.key().as_ref()],
        bump=borrower.bump
    )]
    pub borrower: Account<'info, Borrower>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawBorrowerTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds = [b"borrower", caller.key().as_ref()], bump=borrower.bump)]
    pub borrower: Account<'info, Borrower>,
    #[account(mut, seeds = [b"borrower_token_account", borrower.key().as_ref()], bump=borrower.token_account_bump)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint to stable token
    pub stable_token: Account<'info, Mint>,

    #[account(mut, token::mint = stable_token)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
