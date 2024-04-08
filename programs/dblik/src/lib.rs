use anchor_lang::prelude::*;
pub mod state;
pub use state::*; 
pub mod ctx;
pub use ctx::*;
pub mod utils;
pub use utils::*;

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {

    use super::*;

    pub fn init_transaction(ctx: Context<InitializeTransaction>) -> Result<()> {
        ctx.accounts.process()
    }

    pub fn request_payment(ctx: Context<RequestPayment>, amount: u64, message: String) -> Result<()> {
        ctx.accounts.process(amount, message)
    }

    pub fn confirm_transaction(ctx: Context<ConfirmTransaction>) -> Result<()> {
        ctx.accounts.process()
    }

    pub fn cancel_transaction(ctx: Context<CancelTransaction>) -> Result<()> {
        ctx.accounts.process()
    }

    pub fn expire_transaction(ctx: Context<ExpireTransaction>) -> Result<()> {
        ctx.accounts.process()
    }
}
