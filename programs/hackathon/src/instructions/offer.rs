use crate::CreateOffer;
use crate::{Invest, WithdrawInvestments};
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Transfer};

pub fn create_offer(
    ctx: Context<CreateOffer>,
    id: String,
    description: String,
    goal_amount: f32,
    deadline_date: u64,
    interest_rate_percent: f32,
    installments_total: u8,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.id = id;
    offer.discriminator = ctx.accounts.originator.total_offers;
    offer.originator = ctx.accounts.originator.key();
    offer.description = description;
    offer.goal_amount = goal_amount;
    offer.acquired_amount = (Clock::get()?.unix_timestamp % goal_amount as i64) as f32;
    offer.deadline_date = deadline_date;
    offer.interest_rate_percent = interest_rate_percent;
    offer.installments_total = installments_total;
    offer.credit_score = (Clock::get()?.unix_timestamp % 1000) as u16;
    offer.created_at = Clock::get()?.unix_timestamp; // TODO: find a better way to get the timestamp
    offer.bump = *ctx.bumps.get("offer").unwrap();
    offer.token_bump = *ctx.bumps.get("token").unwrap();
    offer.vault_bump = *ctx.bumps.get("vault").unwrap();

    ctx.accounts.originator.total_offers += 1;

    Ok(())
}
pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
    let token_account = &mut ctx.accounts.investor_token_account;

    let transfer = Transfer {
        from: token_account.to_account_info().clone(),
        to: ctx.accounts.vault_token_account.to_account_info().clone(),
        authority: ctx.accounts.caller.to_account_info().clone(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    token::transfer(CpiContext::new(cpi_program, transfer), amount)?;

    let mint_to = MintTo {
        mint: ctx.accounts.offer_token.to_account_info().clone(),
        to: ctx
            .accounts
            .investor_offer_token_account
            .to_account_info()
            .clone(),
        authority: ctx.accounts.offer.to_account_info().clone(),
    };

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_to,
            &[&[
                b"offer",
                ctx.accounts.offer.id.as_bytes(),
                &[ctx.accounts.offer.bump],
            ]],
        ),
        amount,
    )?;

    Ok(())
}

pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
    Ok(())
}
