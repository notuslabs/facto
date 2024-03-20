use anchor_lang::prelude::*;

#[account]
pub struct Originator {
    pub name: String,
    pub description: String,
    pub total_offers: u8,
    pub bump: u8,
}

impl Originator {
    const LENGTH: usize = 8 + 4 + 32 + 4 + 240 + 1 + 1;
}

#[derive(Accounts)]
pub struct CreateOriginator<'info> {
    #[account(init, payer = payer, space = Originator::LENGTH, seeds = [b"originator", owner.key().as_ref()], bump)]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}