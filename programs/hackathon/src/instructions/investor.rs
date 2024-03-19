use anchor_lang::prelude::*;

use crate::CreateInvestor;

pub fn create_investor(ctx: Context<CreateInvestor>, name: String, owner: Pubkey) -> Result<()> {
    let investor = &mut ctx.accounts.investor;
    investor.name = name;
    investor.owner = owner;
    Ok(())
}