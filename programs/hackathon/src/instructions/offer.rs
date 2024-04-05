use crate::CreateOffer;
use crate::OfferStatus;
use crate::PayInstallment;
use crate::WithdrawInstallment;
use crate::{Invest, WithdrawInvestments};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, MintTo, TransferChecked};

pub fn create_offer(
    ctx: Context<CreateOffer>,
    id: String,
    description: String,
    deadline_date: i64,
    goal_amount: u64,
    start_date: i64,
    min_amount_invest: u64,
    installments_count: u8,
    installments_total_amount: u64,
    installments_next_payment_date: i64,
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
        goal_amount >= 1000000,
        ValidationError::GoalAmountMustBeEqualToOrGreaterThanOne
    );
    require!(
        goal_amount <= 15000000000000,
        ValidationError::GoalAmountExceeded
    );
    require!(
        start_date >= Clock::get()?.unix_timestamp,
        ValidationError::StartDateMustBeInTheFuture
    );
    require!(
        min_amount_invest >= 1000000,
        ValidationError::MinAmountMustBeEqualToOrGreaterThanOne
    );
    require!(
        installments_count >= 1,
        ValidationError::InstallmentsTotalMustBeGreaterThanOne
    );
    require!(
        installments_total_amount > goal_amount,
        ValidationError::InstallmentsTotalAmountMustBeGreaterThanGoalAmount
    );

    let offer = &mut ctx.accounts.offer;
    offer.id = id;
    offer.description = description;
    offer.discriminator = ctx.accounts.borrower.total_offers;
    offer.goal_amount = goal_amount;
    offer.deadline_date = deadline_date;
    offer.acquired_amount = 0;
    offer.borrower = ctx.accounts.borrower.key();
    offer.installments_count = installments_count;
    offer.installments_total_amount = installments_total_amount;
    offer.installments_next_payment_date = installments_next_payment_date;
    offer.total_installments_paid = 0;
    offer.min_amount_invest = min_amount_invest;
    offer.start_date = start_date;
    offer.credit_score = (Clock::get()?.unix_timestamp % 1000) as u16;
    offer.created_at = Clock::get()?.unix_timestamp; // TODO: find a better way to get the timestamp

    offer.bump = *ctx.bumps.get("offer").unwrap();
    offer.token_bump = *ctx.bumps.get("token").unwrap();
    offer.vault_bump = *ctx.bumps.get("vault").unwrap();

    ctx.accounts.borrower.total_offers += 1;
    Ok(())
}

pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
    require!(
        amount >= ctx.accounts.offer.min_amount_invest,
        ValidationError::InvestmentAmountMustBeGreaterThanOfferMinAmount
    );
    require!(
        (ctx.accounts.vault_stable_token_account.amount + amount) <= ctx.accounts.offer.goal_amount,
        ValidationError::InvestmentExceedsGoalAmount
    );
    require!(
        ctx.accounts.offer.get_status() == OfferStatus::Open,
        ValidationError::OfferIsNotOpen
    );

    ctx.accounts.offer.acquired_amount += amount;

    ctx.accounts.investment.total_invested += amount;
    ctx.accounts.investment.offer = ctx.accounts.offer.key();
    ctx.accounts.investment.investor = ctx.accounts.investor.key();
    ctx.accounts.investment.installments_received = 0;
    ctx.accounts.investment.bump = *ctx.bumps.get("investment").unwrap();

    let transfer = TransferChecked {
        from: ctx.accounts.investor_stable_token_account.to_account_info(),
        to: ctx.accounts.vault_stable_token_account.to_account_info(),
        authority: ctx.accounts.investor.to_account_info(),
        mint: ctx.accounts.stable_token.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    token::transfer_checked(
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
        ctx.accounts.stable_token.decimals,
    )?;

    let mint_to = MintTo {
        mint: ctx.accounts.offer_token.to_account_info(),
        to: ctx.accounts.investor_offer_token_account.to_account_info(),
        authority: ctx.accounts.offer.to_account_info(),
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
    require!(
        ctx.accounts.offer.borrower == ctx.accounts.borrower.key(),
        ValidationError::InvalidBorrowerSigner
    );
    let offer_status = ctx.accounts.offer.get_status();
    require!(
        offer_status == OfferStatus::Funded || offer_status == OfferStatus::OnTrack,
        ValidationError::OfferIsNotFunded
    );

    let transfer = TransferChecked {
        authority: ctx.accounts.offer.to_account_info(),
        from: ctx.accounts.vault_stable_token_account.to_account_info(),
        to: ctx.accounts.borrower_token_account.to_account_info(),
        mint: ctx.accounts.stable_token.to_account_info(),
    };

    token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[
                b"offer",
                ctx.accounts.offer.id.as_bytes(),
                &[ctx.accounts.offer.bump],
            ]],
        ),
        ctx.accounts.vault_stable_token_account.amount,
        ctx.accounts.stable_token.decimals,
    )?;

    Ok(())
}

pub fn pay_installment(ctx: Context<PayInstallment>) -> Result<()> {
    let offer_status = ctx.accounts.offer.get_status();
    require!(
        offer_status == OfferStatus::OnTrack
            || offer_status == OfferStatus::Delinquent
            || offer_status == OfferStatus::Funded,
        ValidationError::OfferIsNotOnTrack
    );

    let transfer = TransferChecked {
        from: ctx.accounts.borrower_token_account.to_account_info(),
        to: ctx.accounts.vault_payment_token_account.to_account_info(),
        authority: ctx.accounts.borrower.to_account_info(),
        mint: ctx.accounts.stable_token.to_account_info(),
    };
    token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[
                b"borrower",
                ctx.accounts.caller.key().as_ref(),
                &[ctx.accounts.borrower.bump],
            ]],
        ),
        ctx.accounts.offer.get_installment_amount(),
        ctx.accounts.stable_token.decimals,
    )?;

    ctx.accounts.offer.total_installments_paid += 1;
    let seconds_in_30_days = 60 * 60 * 2; //2592000;
    ctx.accounts.offer.installments_next_payment_date += seconds_in_30_days;

    Ok(())
}

pub fn withdraw_installments(ctx: Context<WithdrawInstallment>) -> Result<()> {
    require!(
        ctx.accounts.investment.installments_received < ctx.accounts.offer.total_installments_paid,
        ValidationError::InstallmentAlreadyPaid
    );

    let amount_to_burn = ctx.accounts.investor_offer_token_account.amount
        / (ctx.accounts.offer.installments_count - ctx.accounts.investment.installments_received)
            as u64;
    let burn_accounts = Burn {
        from: ctx.accounts.investor_offer_token_account.to_account_info(),
        mint: ctx.accounts.offer_token.to_account_info(),
        authority: ctx.accounts.investor.to_account_info(),
    };

    token::burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            burn_accounts,
            &[&[
                b"investor",
                ctx.accounts.caller.key().as_ref(),
                &[ctx.accounts.investor.bump],
            ]],
        ),
        amount_to_burn,
    )?;

    let transfer_accounts = TransferChecked {
        from: ctx.accounts.vault_payment_token_account.to_account_info(),
        to: ctx.accounts.investor_stable_token_account.to_account_info(),
        authority: ctx.accounts.offer.to_account_info(),
        mint: ctx.accounts.stable_token.to_account_info(),
    };
    let rate = ctx.accounts.offer.installments_total_amount / ctx.accounts.offer.goal_amount;
    let amount_transfer = amount_to_burn * rate;
    token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
            &[&[
                b"offer",
                ctx.accounts.offer.id.as_bytes(),
                &[ctx.accounts.offer.bump],
            ]],
        ),
        amount_transfer,
        ctx.accounts.stable_token.decimals,
    )?;

    ctx.accounts.investment.installments_received += 1;

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
    #[msg("The Offer is not funded")]
    OfferIsNotFunded,
    #[msg("The Offer is not on track")]
    OfferIsNotOnTrack,
    #[msg("Caller is not the owner of the Borrower")]
    InvalidBorrowerSigner,
    #[msg("Investor has no installment to receive")]
    InstallmentAlreadyPaid,
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
    #[msg("Installments total must be greater than one")]
    InstallmentsTotalMustBeGreaterThanOne,
    #[msg("Installments total amount must be greater than goal amount")]
    InstallmentsTotalAmountMustBeGreaterThanGoalAmount,
}
