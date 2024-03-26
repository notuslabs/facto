use anchor_lang::prelude::*;
use crate::{CreateOriginator, EditOriginator};

pub fn create_originator(ctx: Context<CreateOriginator>, name: String, description: String) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    originator.bump = ctx.bumps.originator;
    Ok(())
}

pub fn edit_originator(ctx: Context<EditOriginator>, name: String, description: String) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    Ok(())
}