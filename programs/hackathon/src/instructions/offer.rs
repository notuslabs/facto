use crate::CreateOffer;
use crate::CreditScore;
use crate::OfferStatus;
use crate::WithdrawInvestments;
use anchor_lang::prelude::Clock;
use anchor_lang::prelude::*;

pub fn create_offer(
    ctx: Context<CreateOffer>,
    id: String,
    name: String,
    description: String,
    deadline_date: u64,
    goal_amount: f32,
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
    offer.installment_amount = 0.0; // TODO: calculate the installment amount
    offer.credit_score = CreditScore::A; // TODO: in the future we'll have a system to set the credit score
    offer.created_at = Clock::get()?.unix_timestamp; // TODO: find a better way to get the timestamp
    offer.bump = ctx.bumps.offer;
    offer.token_bump = ctx.bumps.token;
    offer.vault_bump = ctx.bumps.vault;
    Ok(())
}

pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
    Ok(())
}
