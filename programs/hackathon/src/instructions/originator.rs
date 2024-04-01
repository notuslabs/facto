use crate::{CreateOriginator, EditOriginator};
use anchor_lang::prelude::*;

pub fn create_originator(
    ctx: Context<CreateOriginator>,
    name: String,
    description: String,
    token_slug: String,
) -> Result<()> {
    require!(name.len() < 30, ValidationError::MaxNameLengthExceeded);
    require!(
        description.len() < 500,
        ValidationError::MaxDescriptionLengthExceeded
    );
    require!(
        token_slug.len() < 30,
        ValidationError::MaxTokenSlugLengthExceeded
    );

    let originator = &mut ctx.accounts.originator;

    originator.name = name;
    originator.description = description;
    originator.total_offers = 0;
    originator.token_slug = token_slug;

    originator.bump = *ctx.bumps.get("originator").unwrap();

    Ok(())
}

pub fn edit_originator(
    ctx: Context<EditOriginator>,
    name: String,
    description: String,
) -> Result<()> {
    require!(name.len() < 30, ValidationError::MaxNameLengthExceeded);
    require!(
        description.len() < 500,
        ValidationError::MaxDescriptionLengthExceeded
    );
    let originator = &mut ctx.accounts.originator;
    originator.name = name;
    originator.description = description;
    Ok(())
}

#[error_code]
enum ValidationError {
    #[msg("Max name length exceeded. Maximum length is 30")]
    MaxNameLengthExceeded,
    #[msg("Max description length exceeded. Maximum length is 500")]
    MaxDescriptionLengthExceeded,
    #[msg("Max token slug length exceeded. Maximum length is 30")]
    MaxTokenSlugLengthExceeded,
}
