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
    installments_start_date: i64,
) -> Result<()> {
    require!(id.len() <= 16, ValidationError::MaxIdLengthExceeded);
    require!(
        description.len() <= 500,
        ValidationError::MaxDescriptionLengthExceeded
    );
    require!(
        deadline_date >= Clock::get()?.unix_timestamp,
        ValidationError::DeadlineDateMustBeInTheFuture
    );
    require!(
        goal_amount >= 1,
        ValidationError::GoalAmountMustBeEqualToOrGreaterThanOne
    );
    require!(
        goal_amount <= 15_000_000,
        ValidationError::GoalAmountExceeded
    );
    if start_date.is_some() {
        require!(
            start_date.unwrap() >= Clock::get()?.unix_timestamp,
            ValidationError::StartDateMustBeInTheFuture
        );
    }
    require!(
        min_amount_invest >= 1,
        ValidationError::MinAmountMustBeEqualToOrGreaterThanOne
    );
    require!(
        interest_rate_percent >= 0.01,
        ValidationError::InterestRatePercentMustBeGreaterThanZero
    );
    require!(
        installments_total >= 1,
        ValidationError::InstallmentsTotalMustBeGreaterThanOne
    );

    // TODO: add check for max installment start date
    // should also check if the start date is less than the monthly period from now
    require!(
        installments_start_date >= Clock::get()?.unix_timestamp + 2592000, // 30 days
        ValidationError::InstallmentsStartDateMustBeThirtyDaysFromNow
    );

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
        ValidationError::InvestmentAmountMustBeGreaterThanOfferMinAmount
    );
    require!(
        (ctx.accounts.vault_token_account.amount + amount) <= ctx.accounts.offer.goal_amount,
        ValidationError::InvestmentExceedsGoalAmount
    );
    require!(
        ctx.accounts.offer.status() == OfferStatus::Open,
        ValidationError::OfferIsNotOpen
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
enum ValidationError {
    #[msg("Investment amount must be greater than offer min amount")]
    InvestmentAmountMustBeGreaterThanOfferMinAmount,
    #[msg("Investment exceeds goal amount")]
    InvestmentExceedsGoalAmount,
    #[msg("Offer is not open")]
    OfferIsNotOpen,
    #[msg("Max ID length exceeded. Maximum length is 16")]
    MaxIdLengthExceeded,
    #[msg("Max description length exceeded. Maximum length is 500")]
    MaxDescriptionLengthExceeded,
    #[msg("Deadline date must be in the future")]
    DeadlineDateMustBeInTheFuture,
    #[msg("Goal amount must be equal to or greater than one")]
    GoalAmountMustBeEqualToOrGreaterThanOne,
    #[msg("Goal amount exceeded. Maximum amount is 15,000,000")]
    GoalAmountExceeded,
    #[msg("Min amount must be equal to or greater than one")]
    MinAmountMustBeEqualToOrGreaterThanOne,
    #[msg("Start date must be in the future")]
    StartDateMustBeInTheFuture,
    #[msg("Interest rate percent must be greater than zero")]
    InterestRatePercentMustBeGreaterThanZero,
    #[msg("Installments total must be greater than one")]
    InstallmentsTotalMustBeGreaterThanOne,
    #[msg("Installments start date must be thirty days from now")]
    InstallmentsStartDateMustBeThirtyDaysFromNow,
}
