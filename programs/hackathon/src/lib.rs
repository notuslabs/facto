use anchor_lang::prelude::*;
use state::*;

#[macro_use]
extern crate dotenv_codegen;

declare_id!(pubkey::str_to_pubkey(dotenv!("FACTO_PROGRAM_ID")));

pub mod instructions;
pub mod pubkey;
pub mod state;

#[program]
pub mod hackathon {
    use super::*;

    pub fn create_borrower(
        ctx: Context<CreateBorrower>,
        name: String,
        description: String,
        token_slug: String,
    ) -> Result<()> {
        instructions::create_borrower(ctx, name, description, token_slug)
    }

    pub fn edit_borrower(
        ctx: Context<EditBorrower>,
        name: String,
        description: String,
    ) -> Result<()> {
        instructions::edit_borrower(ctx, name, description)
    }

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
        instructions::create_offer(
            ctx,
            id,
            description,
            deadline_date,
            goal_amount,
            start_date,
            min_amount_invest,
            installments_count,
            installments_total_amount,
            installments_next_payment_date,
        )
    }

    pub fn invest(ctx: Context<Invest>, _offer_id: String, amount: u64) -> Result<()> {
        instructions::invest(ctx, amount)
    }

    pub fn withdraw_investments(
        ctx: Context<WithdrawInvestments>,
        _offer_id: String,
    ) -> Result<()> {
        instructions::withdraw_investments(ctx)
    }

    pub fn pay_installment(ctx: Context<PayInstallment>, _offer_id: String) -> Result<()> {
        instructions::pay_installment(ctx)
    }

    pub fn withdraw_installment(
        ctx: Context<WithdrawInstallment>,
        _offer_id: String,
    ) -> Result<()> {
        instructions::withdraw_installments(ctx)
    }

    pub fn create_investor(ctx: Context<CreateInvestor>, name: String) -> Result<()> {
        instructions::create_investor(ctx, name)
    }

    pub fn edit_investor(ctx: Context<EditInvestor>, name: String) -> Result<()> {
        instructions::edit_investor(ctx, name)
    }

    pub fn deposit_tokens(ctx: Context<DepositTokens>, amount: u64) -> Result<()> {
        instructions::deposit_tokens(ctx, amount)
    }

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
        instructions::withdraw_tokens(ctx, amount)
    }

    pub fn withdraw_borrower_tokens(
        ctx: Context<WithdrawBorrowerTokens>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw_borrower_tokens(ctx, amount)
    }
}
