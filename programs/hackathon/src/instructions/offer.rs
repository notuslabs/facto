use anchor_lang::prelude::*;
use crate::CreateOffer;

pub fn create_offer(ctx: Context<CreateOffer>, title: String) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.title = title;
    offer.owner = *ctx.accounts.owner.key;
    Ok(())
}
