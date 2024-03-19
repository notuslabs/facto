use anchor_lang::prelude::*;

#[account]
pub struct Originator {
    pub name: String,
    pub description: String,
}

impl Originator {
    const LENGTH: usize = 8 + 4 + 32 + 4 + 240;
}

#[derive(Accounts)]
pub struct CreateOriginator<'info> {
    #[account(init, payer = payer, space = Originator::LENGTH)]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}