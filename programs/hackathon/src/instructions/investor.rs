use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, TransferChecked};

use crate::{CreateInvestor, DepositTokens, EditInvestor, WithdrawTokens};

pub fn create_investor(ctx: Context<CreateInvestor>, name: String) -> Result<()> {
    require!(name.len() < 30, ValidationError::MaxNameLengthExceeded);
    let investor = &mut ctx.accounts.investor;
    investor.name = name;
    investor.bump = *ctx.bumps.get("investor").unwrap();
    investor.token_account_bump = *ctx.bumps.get("investor_stable_token_account").unwrap();
    Ok(())
}

pub fn deposit_tokens(ctx: Context<DepositTokens>, amount: u64) -> Result<()> {
    require!(
        amount >= 1,
        ValidationError::AmountMustBeEqualToOrGreaterThanOne
    );
    let investor_token_account = &mut ctx.accounts.investor_stable_token_account;

    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.stable_coin.to_account_info(),
                to: investor_token_account.to_account_info(),
                authority: ctx.accounts.caller.to_account_info(),
            },
        ),
        amount,
    )
    .unwrap();

    Ok(())
}

pub fn edit_investor(ctx: Context<EditInvestor>, name: String) -> Result<()> {
    require!(name.len() < 30, ValidationError::MaxNameLengthExceeded);
    let investor = &mut ctx.accounts.investor;
    investor.name = name;

    Ok(())
}

pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
    let investor_token_account = &mut ctx.accounts.investor_stable_token_account;
    let stable_token = &ctx.accounts.stable_coin;

    require!(
        amount <= investor_token_account.amount,
        ValidationError::InsufficientBalance
    );

    let transfer = TransferChecked {
        from: investor_token_account.to_account_info(),
        to: ctx.accounts.to_token_account.to_account_info(),
        authority: ctx.accounts.investor.to_account_info(),
        mint: stable_token.to_account_info(),
    };

    let transfer_result = token::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            &[&[
                b"investor",
                ctx.accounts.caller.key().as_ref(),
                &[ctx.accounts.investor.bump],
            ]],
        ),
        amount,
        stable_token.decimals,
    );

    match transfer_result {
        Ok(_) => Ok(()),
        Err(error) => {
            msg!("Transfer failed. Err: {}", error);

            err!(ValidationError::TransferFailedUnknown)
        }
    }
}

#[error_code]
enum ValidationError {
    #[msg("Max name length exceeded. Maximum length is 30")]
    MaxNameLengthExceeded,
    #[msg("Amount must be equal to or greater than 1")]
    AmountMustBeEqualToOrGreaterThanOne,
    #[msg("Insufficient Balance")]
    InsufficientBalance,
    #[msg("Transfer failed with an unknown error.")]
    TransferFailedUnknown,
}
