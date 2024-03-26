use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Originator {
    #[max_len(50)]
    pub name: String,
    #[max_len(256)]
    pub description: String,
    pub total_offers: u32,
    #[max_len(30)]
    pub token_slug: String,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateOriginator<'info> {
    #[account(init, payer = payer, space = Originator::INIT_SPACE, seeds = [b"originator", owner.key().as_ref()], bump)]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
