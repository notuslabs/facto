use crate::CreateOriginator;
use anchor_lang::prelude::*;

pub fn create_originator(
    ctx: Context<CreateOriginator>,
    name: String,
    description: String,
    token_slug: String,
) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    originator.total_offers = 0;
    originator.bump = *ctx.bumps.get("originator").unwrap();
    originator.token_slug = token_slug;
    Ok(())
}
