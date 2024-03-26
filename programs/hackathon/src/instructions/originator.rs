use crate::{CreateOriginator, EditOriginator};
use anchor_lang::prelude::*;

pub fn create_originator(
    ctx: Context<CreateOriginator>,
    name: String,
    description: String,
) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    originator.total_offers = 0;
    originator.bump = *ctx.bumps.get("originator").unwrap();
    Ok(())
}

pub fn edit_originator(
    ctx: Context<EditOriginator>,
    name: String,
    description: String,
) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    Ok(())
}
