use anchor_lang::prelude::*;
use state::*;

declare_id!("fsbZaAAcxGLVUikWonjzJJdmJv4Aj2CWPxgRsGaUUbu");

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
        goal_amount: f32,
        deadline_date: u64,
        interest_rate_percent: f32,
        installments_total: u8,
    ) -> Result<()> {
        instructions::create_offer(
            ctx,
            id,
            description,
            goal_amount,
            deadline_date,
            interest_rate_percent,
            installments_total,
        )
    }

    pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
        instructions::invest(ctx, amount)
    }

    pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
        instructions::withdraw_investments(ctx)
    }
}
