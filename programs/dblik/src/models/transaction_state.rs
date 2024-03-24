use crate::*;
use core::time;
use std::str::FromStr;
use std::io::Error;
use anchor_lang::solana_program::clock;

#[derive(Copy, Clone, Debug, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum TransactionState {
    Initialized,
    Pending,
    Succeed,
    Expired
}

// impl TransactionState {
//     pub fn set_initialized(&mut self, transaction: &Transaction) -> Result<(), > {
//         let now: i64 = clock::Clock::get()?.unix_timestamp;

//         if transaction.timestamp == 0
//         {
//             *self = TransactionState::Initialized;
//             return Ok(());
//         }

//         //
//     }
// }