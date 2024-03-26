use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Offer is not yours")]
    OfferIsNotYours,
}