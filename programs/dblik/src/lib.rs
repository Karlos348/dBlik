use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use std::mem::size_of;
pub mod state;
pub mod models;
pub use state::*; 
pub mod ctx;
pub use ctx::*;

use crate::models::transaction_state::*;
use anchor_lang::Discriminator;
use anchor_lang::solana_program::clock;
use std::str::FromStr;

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {

    use super::*;

    pub fn init_transaction(ctx: Context<InitializeTransaction>) -> Result<()> {
        //ctx.accounts.process()
        let customer = ctx.accounts.signer.key();
        let discriminator = Transaction::discriminator();
        let timestamp: i64 = clock::Clock::get()?.unix_timestamp;
        let transaction = Transaction {
            customer,
            timestamp,
            state: TransactionState::Initialized,
            store: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            amount: 0,
            message: String::new(),
        };
        let data = (discriminator, transaction);
        data.serialize(&mut *ctx.accounts.account.try_borrow_mut_data()?)?;
        Ok(())
    }
}

// #[error_code]
// pub enum Errors {
//     #[msg("Invalid code")]
//     InvalidCode
// }