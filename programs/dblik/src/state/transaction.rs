use crate::*;
use anchor_lang::Discriminator;
use anchor_lang::solana_program::clock;
use std::str::FromStr;

#[account]
pub struct Transaction {
    pub customer: Pubkey,
    pub timestamp: i64,
    pub state: TransactionState,
    pub store: Pubkey,
    pub amount: u64,
    pub message: String
}

pub trait TransactionAccount {
    fn new_serialized_transaction(customer: Pubkey) -> Result<Vec<u8>>;
}

impl TransactionAccount for Account<'_, Transaction> {
    fn new_serialized_transaction(customer: Pubkey) -> Result<Vec<u8>> {
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
        let mut serialized = Vec::new();
        data.serialize(&mut serialized)?;
        Ok(serialized)
    }
}


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