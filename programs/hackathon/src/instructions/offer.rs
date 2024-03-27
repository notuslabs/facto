use crate::CreateOffer;
use crate::CreditScore;
use crate::OfferStatus;
use crate::{Invest, WithdrawInvestments};
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Transfer};

pub fn create_offer(
    ctx: Context<CreateOffer>,
    id: String,
    name: String,
    description: String,
    deadline_date: u64,
    goal_amount: u64,
    min_amount_invest: u64,
    interest_rate_percent: f32,
    installments_total: u8,
    installments_start_date: Option<u64>,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.id = id;
    offer.name = name;
    offer.description = description;
    offer.deadline_date = deadline_date;
    offer.goal_amount = goal_amount;
    offer.status = OfferStatus::Open;
    offer.interest_rate_percent = interest_rate_percent;
    offer.installments_total = installments_total;
    offer.installments_paid = 0;
    offer.installments_start_date = installments_start_date;
    offer.installment_amount = 0.0; // TODO: calculate the installment amount
    offer.credit_score = CreditScore::A; // TODO: in the future we'll have a system to set the credit score
    offer.created_at = Clock::get()?.unix_timestamp; // TODO: find a better way to get the timestamp
    offer.bump = *ctx.bumps.get("offer").unwrap();
    offer.token_bump = *ctx.bumps.get("token").unwrap();
    offer.vault_bump = *ctx.bumps.get("vault").unwrap();
    offer.min_amount_invest = min_amount_invest;
    Ok(())
}

pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
    require!(
        amount >= ctx.accounts.offer.min_amount_invest,
        OfferErrors::MinAmountRequired
    );
    require!(
        (ctx.accounts.vault_token_account.amount + amount) <= ctx.accounts.offer.goal_amount,
        OfferErrors::GoalAmountExceeded
    );
    require!(
        ctx.accounts.offer.status == OfferStatus::Open,
        OfferErrors::OfferIsNotOpen
    );

    ctx.accounts.offer.acquired_amount += amount;

    let transfer = Transfer {
        from: ctx
            .accounts
            .investor_token_account
            .to_account_info()
            .clone(),
        to: ctx.accounts.vault_token_account.to_account_info().clone(),
        authority: ctx.accounts.investor.to_account_info().clone(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    token::transfer(
        CpiContext::new_with_signer(
            cpi_program,
            transfer,
            &[&[
                b"investor",
                ctx.accounts.caller.key().as_ref(),
                &[ctx.accounts.investor.bump],
            ]],
        ),
        amount,
    )?;

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

pub fn withdraw_investments(_ctx: Context<WithdrawInvestments>) -> Result<()> {
    Ok(())
}

#[error_code]
pub enum OfferErrors {
    #[msg("Min amount required")]
    MinAmountRequired,
    #[msg("Goal amount exceeded")]
    GoalAmountExceeded,
    #[msg("The Offer is not open")]
    OfferIsNotOpen,
}
