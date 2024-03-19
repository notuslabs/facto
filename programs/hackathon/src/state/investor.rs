use anchor_lang::prelude::*;

#[account]
pub struct Investor {
    pub name: String,
    pub owner: Pubkey,
}

impl Investor {
    const LENGTH: usize = 8 + 4 + 32 + 32; // default length + (string prefix length + investor name length) + owner pubkey length
}

#[derive(Accounts)]
pub struct CreateInvestor<'info> {
    #[account(init, payer = payer, space = Investor::LENGTH)]
    pub investor: Account<'info, Investor>,
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}