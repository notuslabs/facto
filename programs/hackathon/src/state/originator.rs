use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Originator {
    #[max_len(30)]
    pub name: String,
    #[max_len(500)]
    pub description: String,
    pub total_offers: u8,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateOriginator<'info> {
    #[account(init, payer = payer, space = Originator::INIT_SPACE, seeds = [b"originator", caller.key().as_ref()], bump)]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EditOriginator<'info> {
    #[account(
        mut,
        seeds = [b"originator", caller.key().as_ref()],
        bump=originator.bump
    )]
    pub originator: Account<'info, Originator>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}
