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
    fn assign_store(&mut self, store: Pubkey, amount: u64, message: String) -> Result<()>;
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
    
    fn assign_store(&mut self, store: Pubkey, amount: u64, message: String) -> Result<()> {

        let now = clock::Clock::get()?.unix_timestamp;
        require!(self.state == TransactionState::Initialized, TransactionErrors::InvalidTransactionState);
        require!(now <= self.timestamp + 120 /* 2 minutes */, TransactionErrors::TransactionExpired);
        require!(self.customer != store, TransactionErrors::AccountsConflict);

        self.store = store;
        self.amount = amount;
        self.message = message;
        self.state = TransactionState::Pending;
        Ok(())
    }  
}


#[derive(Copy, Clone, Debug, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum TransactionState {
    Initialized,
    Pending,
    Succeed,
    Expired,
    Canceled
}

#[error_code]
pub enum TransactionErrors {
    #[msg("Invalid transaction state")]
    InvalidTransactionState,
    #[msg("Transaction expired")]
    TransactionExpired,
    #[msg("Accounts cannot be the same")]
    AccountsConflict
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