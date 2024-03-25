use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Transfer};

use crate::{CreateInvestor, DepositTokens, EditInvestor, WithdrawTokens};

pub fn create_investor(ctx: Context<CreateInvestor>, name: String) -> Result<()> {
    let investor = &mut ctx.accounts.investor;
    investor.name = name;
    investor.owner = ctx.accounts.owner.key();
    investor.bump = ctx.bumps.investor;
    Ok(())
}

pub fn edit_investor(ctx: Context<EditInvestor>, name: String) -> Result<()> {
    let investor = &mut ctx.accounts.investor;
    investor.name = name;

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

pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> { 
    let investor_token_account = &mut ctx.accounts.investor_token_account;

    token::transfer(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: investor_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        },
        &[&[b"investor", ctx.accounts.owner.key().as_ref(), &[ctx.accounts.investor.bump]]],
    ), amount).unwrap();

    Ok(())
}