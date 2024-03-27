use crate::CreateOffer;
use crate::OfferStatus;
use crate::{Invest, WithdrawInvestments};
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Transfer};

pub fn create_offer(
    ctx: Context<CreateOffer>,
    id: String,
    description: String,
    deadline_date: i64,
    goal_amount: u64,
    start_date: Option<i64>,
    min_amount_invest: u64,
    interest_rate_percent: f32,
    installments_total: u8,
    installments_start_date: Option<i64>,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.id = id;
    offer.description = description;
    offer.discriminator = ctx.accounts.originator.total_offers;
    offer.interest_rate_percent = interest_rate_percent;
    offer.goal_amount = goal_amount;
    offer.deadline_date = deadline_date;
    offer.acquired_amount = (Clock::get()?.unix_timestamp % goal_amount as i64) as u64;
    offer.originator = ctx.accounts.originator.key();
    offer.installments_total = installments_total;
    offer.installments_start_date = installments_start_date;
    offer.min_amount_invest = min_amount_invest;
    offer.start_date = start_date;
    offer.credit_score = (Clock::get()?.unix_timestamp % 1000) as u16;
    offer.created_at = Clock::get()?.unix_timestamp; // TODO: find a better way to get the timestamp

    offer.bump = *ctx.bumps.get("offer").unwrap();
    offer.token_bump = *ctx.bumps.get("token").unwrap();
    offer.vault_bump = *ctx.bumps.get("vault").unwrap();

    ctx.accounts.originator.total_offers += 1;
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
        ctx.accounts.offer.get_status() == OfferStatus::Open,
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

pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
    require!(ctx.accounts.offer.originator == ctx.accounts.originator.key(), OfferErrors::InvalidOriginatorSigner);
    require!(
        ctx.accounts.offer.get_status() == OfferStatus::Funded,
        OfferErrors::OfferIsNotFunded
    );

    let transfer = Transfer {
        authority: ctx.accounts.offer.to_account_info().clone(),
        from: ctx.accounts.vault_token_account.to_account_info().clone(),
        to: ctx
            .accounts
            .originator_stable_token_account
            .to_account_info()
            .clone(),
    };

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[
                b"offer",
                ctx.accounts.offer.id.as_bytes(),
                &[ctx.accounts.offer.bump],
            ]],
        ),
        ctx.accounts.vault_token_account.amount,
    )?;

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
    #[msg("The Offer is not funded")]
    OfferIsNotFunded,
    #[msg("Caller is not the owner of the Originator")]
    InvalidOriginatorSigner,
}
