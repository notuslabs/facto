use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer as SplTransfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::CreateOffer;
use crate::WithdrawInvestments;

pub fn create_offer(ctx: Context<CreateOffer>, title: String) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.title = title;
    offer.owner = *ctx.accounts.owner.key;
    offer.bump = ctx.bumps.offer;
    Ok(())
}

pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;

    let transfer = SplTransfer {
        from: token_account.to_account_info().clone(),
        to: ctx.accounts.destination.to_account_info().clone(),
        authority: ctx.accounts.from.to_account_info().clone(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    token::transfer(CpiContext::new(cpi_program, transfer), 12)?;

    Ok(())
}