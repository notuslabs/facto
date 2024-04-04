use crate::{CreateBorrower, EditBorrower, WithdrawBorrowerTokens};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TransferChecked};

pub fn create_borrower(
    ctx: Context<CreateBorrower>,
    name: String,
    description: String,
    token_slug: String,
) -> Result<()> {
    require!(name.len() < 30, ValidationErrors::MaxNameLengthExceeded);
    require!(
        description.len() < 500,
        ValidationErrors::MaxDescriptionLengthExceeded
    );
    require!(
        token_slug.len() < 30,
        ValidationErrors::MaxTokenSlugLengthExceeded
    );

    let borrower = &mut ctx.accounts.borrower;

    borrower.name = name;
    borrower.description = description;
    borrower.total_offers = 0;
    borrower.token_slug = token_slug;

    borrower.bump = *ctx.bumps.get("borrower").unwrap();
    borrower.token_account_bump = *ctx.bumps.get("borrower_token_account").unwrap();

    Ok(())
}

pub fn edit_borrower(ctx: Context<EditBorrower>, name: String, description: String) -> Result<()> {
    require!(name.len() < 30, ValidationErrors::MaxNameLengthExceeded);
    require!(
        description.len() < 500,
        ValidationErrors::MaxDescriptionLengthExceeded
    );
    let borrower = &mut ctx.accounts.borrower;
    borrower.name = name;
    borrower.description = description;
    Ok(())
}

pub fn withdraw_borrower_tokens(ctx: Context<WithdrawBorrowerTokens>, amount: u64) -> Result<()> {
    let borrower = &mut ctx.accounts.borrower;
    let borrower_token_account = &mut ctx.accounts.borrower_token_account;
    let to_token_account = &mut ctx.accounts.to_token_account;
    let caller = &mut ctx.accounts.caller;
    let stable_token = &mut ctx.accounts.stable_token;

    require!(
        amount <= borrower_token_account.amount,
        ValidationErrors::InsufficientBalance
    );

    let transfer = TransferChecked {
        from: borrower_token_account.to_account_info(),
        authority: borrower.to_account_info(),
        to: to_token_account.to_account_info(),
        mint: stable_token.to_account_info(),
    };

    let transfer_result = token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[b"borrower", caller.key().as_ref(), &[borrower.bump]]],
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
