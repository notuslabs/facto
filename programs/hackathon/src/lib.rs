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