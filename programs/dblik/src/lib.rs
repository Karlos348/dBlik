use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use std::mem::size_of;
pub mod state;
pub mod models;
pub use state::*; 
pub mod ctx;
pub use ctx::*;

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {

    use super::*;

    pub fn init_transaction(ctx: Context<InitializeTransaction>) -> Result<()> {
        ctx.accounts.process()
    }
}

// #[error_code]
// pub enum Errors {
//     #[msg("Invalid code")]
//     InvalidCode
// }