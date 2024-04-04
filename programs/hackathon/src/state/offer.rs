use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::{Borrower, Investor, InvestorInstallments};

#[derive(Clone, AnchorDeserialize, AnchorSerialize, InitSpace, PartialEq)]
pub enum OfferStatus {
    StartingSoon,
    Failed,
    Canceled,
    Open,
    Funded,
    OnTrack,
    Delinquent,
    Finished,
}

#[derive(Clone, AnchorDeserialize, AnchorSerialize, InitSpace)]
pub enum CreditScore {
    AAA,
    AA,
    A,
    BBB,
    BB,
    B,
    CCC,
    CC,
    C,
    DDD,
    DD,
    D,
}

#[account]
#[derive(InitSpace)]
pub struct Offer {
    pub borrower: Pubkey,
    #[max_len(16)]
    pub id: String,
    #[max_len(500)]
    pub description: String,
    pub discriminator: u32,
    pub interest_rate_percent: f32,
    pub goal_amount: u64,
    pub deadline_date: i64,
    pub acquired_amount: u64,
    pub installments_count: u8,
    pub installments_total_amount: u64,
    pub total_installments_paid: u8,
    pub installments_next_payment_date: i64,
    pub min_amount_invest: u64,
    pub start_date: i64,
    pub credit_score: u16,
    pub created_at: i64,
    pub bump: u8,
    pub token_bump: u8,
    pub vault_bump: u8,
}

pub trait OfferInterface {
    fn get_status(&self) -> OfferStatus;
}

impl<'info> Offer {
    pub fn get_status(&self) -> OfferStatus {
        let clock = Clock::get().unwrap();
        let current_timestamp = clock.unix_timestamp;

        if current_timestamp < self.start_date {
            return OfferStatus::StartingSoon;
        }

        if current_timestamp < self.deadline_date && self.acquired_amount < self.goal_amount {
            return OfferStatus::Open;
        }

        if self.acquired_amount == self.goal_amount {
            if current_timestamp < self.deadline_date {
                return OfferStatus::Funded;
            }

            if self.total_installments_paid == self.installments_count {
                return OfferStatus::Finished;
            }

            if current_timestamp <= self.installments_next_payment_date {
                return OfferStatus::OnTrack;
            } else {
                return OfferStatus::Delinquent;
            }
        }

        OfferStatus::Failed
    }

    pub fn get_installment_amount(&self) -> u64 {
        self.installments_total_amount / self.installments_count as u64
    }
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct CreateOffer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds = [b"borrower", caller.key().as_ref()], bump=borrower.bump)]
    pub borrower: Box<Account<'info, Borrower>>,
    #[account(init, payer = payer, space = Offer::INIT_SPACE, seeds = [b"offer", id.as_bytes()], bump)]
    pub offer: Box<Account<'info, Offer>>,
    #[account(
        init,
        seeds = [b"offer_token", offer.key().as_ref()],
        bump,
        payer = payer,
        mint::authority = offer,
        mint::decimals = 6,
    )]
    pub token: Box<Account<'info, Mint>>,

    #[account(mut, mint::decimals = 6)]
    // TODO: add constraint to ensure that the token is a stablecoin
    pub stable_token: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [b"offer_vault", offer.key().as_ref()],
        bump,
        payer = payer,
        token::mint = stable_token,
        token::authority = offer
      )]
    pub vault: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
#[instruction(offer_id: String)]
pub struct Invest<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(
        init_if_needed,
        payer = payer,
        token::mint = offer_token,
        token::authority = investor,
        seeds=[b"investor_offer_token_account", offer.key().as_ref(), investor.key().as_ref()],
        bump
    )]
    pub investor_offer_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"offer_vault", offer.key().as_ref()], bump=offer.vault_bump)]
    pub vault_stable_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"investor_stable_token_account", investor.key().as_ref()], bump=investor.token_account_bump)]
    pub investor_stable_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"offer", offer_id.as_bytes()], bump=offer.bump)]
    pub offer: Account<'info, Offer>,
    #[account(mut, seeds = [b"offer_token", offer.key().as_ref()], bump=offer.token_bump)]
    pub offer_token: Account<'info, Mint>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint
    pub stable_token: Account<'info, Mint>,
    #[account(mut, seeds=[b"investor", caller.key().as_ref()], bump=investor.bump)]
    pub investor: Account<'info, Investor>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
#[instruction(offer_id: String)]
pub struct WithdrawInvestments<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds=[b"offer_vault", offer.key().as_ref()], bump=offer.vault_bump)]
    pub vault_stable_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"borrower_token_account", borrower.key().as_ref()], bump=borrower.token_account_bump)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"borrower", caller.key().as_ref()], bump=borrower.bump)]
    pub borrower: Account<'info, Borrower>,
    #[account(mut, seeds=[b"offer", offer_id.as_bytes()], bump=offer.bump)]
    pub offer: Account<'info, Offer>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint
    pub stable_token: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(offer_id: String)]
pub struct PayInstallment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(mut, seeds=[b"offer", offer_id.as_bytes()], bump=offer.bump)]
    pub offer: Account<'info, Offer>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint
    pub stable_token: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = payer,
        token::mint = stable_token,
        token::authority = offer,
        seeds=[b"vault_payment_token_account", offer.key().as_ref()],
        bump
    )]
    pub vault_payment_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"borrower_token_account", borrower.key().as_ref()], bump=borrower.token_account_bump)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"borrower", caller.key().as_ref()], bump = borrower.bump)]
    pub borrower: Account<'info, Borrower>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(offer_id: String)]
pub struct WithdrawInstallment<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + InvestorInstallments::INIT_SPACE,
        seeds = [b"investor_installment", offer.key().as_ref(), investor.key().as_ref()],
        bump
    )]
    pub investor_installment: Account<'info, InvestorInstallments>,
    /// CHECK:
    pub owner_investor: AccountInfo<'info>,
    #[account(mut, seeds=[b"investor", owner_investor.key().as_ref()], bump=investor.bump)]
    pub investor: Account<'info, Investor>,
    #[account(mut, seeds=[b"investor_offer_token_account", offer.key().as_ref(), investor.key().as_ref()], bump)]
    pub investor_offer_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"investor_stable_token_account", investor.key().as_ref()], bump=investor.token_account_bump)]
    pub investor_stable_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds=[b"vault_payment_token_account", offer.key().as_ref()], bump)]
    pub vault_payment_token_account: Account<'info, TokenAccount>,
    #[account(mut, mint::decimals = 6)] // TODO: add constraint
    pub stable_token: Account<'info, Mint>,
    #[account(mut, seeds = [b"offer_token", offer.key().as_ref()], bump=offer.token_bump)]
    pub offer_token: Account<'info, Mint>,
    #[account(mut, seeds=[b"offer", offer_id.as_bytes()], bump=offer.bump)]
    pub offer: Account<'info, Offer>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
