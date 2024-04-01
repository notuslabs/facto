use crate::{CreateOriginator, EditOriginator, WithdrawOriginatorTokens};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TransferChecked};

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
    originator.token_account_bump = *ctx.bumps.get("originator_token_account").unwrap();

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

pub fn withdraw_originator_tokens(
    ctx: Context<WithdrawOriginatorTokens>,
    amount: u64,
) -> Result<()> {
    let originator = &mut ctx.accounts.originator;
    let originator_token_account = &mut ctx.accounts.originator_token_account;
    let to_token_account = &mut ctx.accounts.to_token_account;
    let caller = &mut ctx.accounts.caller;
    let stable_token = &mut ctx.accounts.stable_token;

    require!(
        amount <= originator_token_account.amount,
        ValidationErrors::InsufficientBalance
    );

    let transfer = TransferChecked {
        from: originator_token_account.to_account_info(),
        authority: originator.to_account_info(),
        to: to_token_account.to_account_info(),
        mint: stable_token.to_account_info(),
    };

    let transfer_result = token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[b"originator", caller.key().as_ref(), &[originator.bump]]],
        ),
        amount,
        stable_token.decimals,
    );

    match transfer_result {
        Ok(()) => return Ok(()),
        Err(error) => {
            msg!("Transfer failed. Err: {}", error);
            return err!(ValidationErrors::TransferFailedUnknown);
        }
    }
}

#[error_code]
enum ValidationErrors {
    #[msg("Insufficient Balance")]
    InsufficientBalance,
    #[msg("Transfer failed with an unknown error.")]
    TransferFailedUnknown,
    #[msg("Max name length exceeded. Maximum length is 30")]
    MaxNameLengthExceeded,
    #[msg("Max description length exceeded. Maximum length is 500")]
    MaxDescriptionLengthExceeded,
    #[msg("Max token slug length exceeded. Maximum length is 30")]
    MaxTokenSlugLengthExceeded,
}
