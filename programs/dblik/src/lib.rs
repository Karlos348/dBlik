use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use std::mem::size_of;
pub mod state;
pub use state::*; 
pub mod ctx;
pub use ctx::*; 
use self::customer::{CustomerAccount};

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {

    use super::*;

    pub fn init_customer(ctx: Context<InitializeCustomer>) -> Result<()> {
        ctx.accounts.process()
    }
}

// pub struct Transaction {
//     timestamp: i64,
//     customer: Option<Pubkey>,
//     shop: Pubkey,
//     code: u64
// }

// #[error_code]
// pub enum Errors {
//     #[msg("Invalid code")]
//     InvalidCode
// }