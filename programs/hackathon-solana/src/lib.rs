use anchor_lang::prelude::*;

declare_id!("4AwUWNiVvWThLVPiSnY9nzqcMJBDPJqazqMcLsqr1scx");

#[program]
pub mod hackathon_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
