use anchor_lang::prelude::*;
use state::*;

declare_id!("7sffxVRTvBY1CUezQcbWAC4J6Gp134tktjrzLExnsfcn");

pub mod state;
pub mod instructions;

#[program]
pub mod hackathon {
    use super::*;

    pub fn create_originator(ctx: Context<CreateOriginator>, name: String, description: String) -> Result<()> {
        instructions::create_originator(ctx, name, description)
    }

    pub fn create_offer(ctx: Context<CreateOffer>, title: String) -> Result<()> {
        instructions::create_offer(ctx, title)
    }

    pub fn withdraw_investments(ctx: Context<WithdrawInvestments>) -> Result<()> {
        instructions::withdraw_investments(ctx)
    }
}