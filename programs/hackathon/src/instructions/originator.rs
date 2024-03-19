use anchor_lang::prelude::*;
use crate::CreateOriginator;

pub fn create_originator(ctx: Context<CreateOriginator>, name: String, description: String) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    Ok(())
}