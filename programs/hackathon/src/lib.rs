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
    ) -> Result<()> {
        instructions::create_originator(ctx, name, description)
    }

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
        instructions::create_offer(
            ctx,
            id,
            name,
            description,
            deadline_date,
            goal_amount,
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
}
