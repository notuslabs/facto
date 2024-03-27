use anchor_lang::prelude::*;
use state::*;

declare_id!("7sffxVRTvBY1CUezQcbWAC4J6Gp134tktjrzLExnsfcn");

pub mod instructions;
pub mod state;

#[program]
pub mod hackathon {
    use super::*;

    pub fn create_originator(
        ctx: Context<CreateOriginator>,
        name: String,
        description: String,
        token_slug: String,
    ) -> Result<()> {
        instructions::create_originator(ctx, name, description, token_slug)
    }

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
        instructions::create_offer(
            ctx,
            id,
            description,
            deadline_date,
            goal_amount,
            start_date,
            min_amount_invest,
            interest_rate_percent,
            installments_total,
            installments_start_date,
        )
    }

    pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
        instructions::invest(ctx, amount)
    }

    pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
        instructions::withdraw_investments(ctx)
    }

    pub fn edit_originator(
        ctx: Context<EditOriginator>,
        name: String,
        description: String,
    ) -> Result<()> {
        instructions::edit_originator(ctx, name, description)
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
}
