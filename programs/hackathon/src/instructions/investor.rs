use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo};

use crate::{CreateInvestor, DepositTokens};

pub fn create_investor(ctx: Context<CreateInvestor>, name: String) -> Result<()> {
    let investor = &mut ctx.accounts.investor;
    investor.name = name;
    investor.owner = ctx.accounts.owner.key();

    Ok(())
}

pub fn deposit_tokens(ctx: Context<DepositTokens>, amount: u64) -> Result<()> { 
    let investor_token_account = &mut ctx.accounts.investor_token_account;

    token::mint_to(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: investor_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    ), amount).unwrap();


    Ok(())
}