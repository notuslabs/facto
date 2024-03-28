use crate::CreateOffer;
use crate::OfferStatus;
use crate::PayInstallment;
use crate::WithdrawInstallment;
use crate::{Invest, WithdrawInvestments};
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::Burn;
use anchor_spl::token::{MintTo, Transfer};

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
    let offer = &mut ctx.accounts.offer;
    offer.id = id;
    offer.description = description;
    offer.discriminator = ctx.accounts.originator.total_offers;
    offer.goal_amount = goal_amount;
    offer.deadline_date = deadline_date;
    offer.acquired_amount = 0;
    offer.originator = ctx.accounts.originator.key();
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
    require!(
        ctx.accounts.offer.originator == ctx.accounts.originator.key(),
        OfferErrors::InvalidOriginatorSigner
    );
    require!(
        ctx.accounts.offer.get_status() == OfferStatus::Funded,
        OfferErrors::OfferIsNotFunded
    );

    let transfer = Transfer {
        authority: ctx.accounts.offer.to_account_info().clone(),
        from: ctx.accounts.vault_token_account.to_account_info().clone(),
        to: ctx
            .accounts
            .originator_token_account
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

pub fn pay_installment(ctx: Context<PayInstallment>) -> Result<()> {
    require!(
        ctx.accounts.offer.get_status() == OfferStatus::OnTrack,
        OfferErrors::OfferIsNotOnTrack
    );

    let transfer = Transfer {
        from: ctx
            .accounts
            .originator_token_account
            .to_account_info(),
        to: ctx.accounts.vault_payment_token_account.to_account_info(),
        authority: ctx.accounts.originator.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[
                b"originator",
                ctx.accounts.caller.key().as_ref(),
                &[ctx.accounts.originator.bump],
            ]],
        ),
        ctx.accounts.offer.get_installment_amount(),
    )?;
    ctx.accounts.offer.total_installments_paid += 1;

    Ok(())
}

pub fn withdraw_installments(ctx: Context<WithdrawInstallment>) -> Result<()> {
    require!(
        ctx.accounts.investor_installment.count_received
            < ctx.accounts.offer.total_installments_paid,
        OfferErrors::InstallmentAlreadyPaid
    );

    let amount_to_burn = ctx.accounts.investor_offer_token_account.amount
        / (ctx.accounts.offer.installments_count - ctx.accounts.investor_installment.count_received)
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
                ctx.accounts.owner_investor.key().as_ref(),
                &[ctx.accounts.investor.bump],
            ]],
        ),
        amount_to_burn,
    )?;

    let transfer_accounts = Transfer {
        from: ctx.accounts.vault_payment_token_account.to_account_info(),
        to: ctx.accounts.investor_token_account.to_account_info(),
        authority: ctx.accounts.offer.to_account_info(),
    };
    let rate = ctx.accounts.offer.installments_total_amount / ctx.accounts.offer.goal_amount;
    let amount_transfer = amount_to_burn * rate;
    token::transfer(
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
    )?;

    ctx.accounts.investor_installment.count_received += 1;

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
    #[msg("The Offer is not on track")]
    OfferIsNotOnTrack,
    #[msg("Caller is not the owner of the Originator")]
    InvalidOriginatorSigner,
    #[msg("Investor has no installment to receive")]
    InstallmentAlreadyPaid,
}
