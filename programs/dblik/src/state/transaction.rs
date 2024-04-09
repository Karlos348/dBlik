use crate::consts::TRANSACTION_EXPIRATION_TIME_IN_SECONDS;
use crate::*;
use anchor_lang::Discriminator;
use anchor_lang::solana_program::clock;
use self::consts::DEFAULT_PUBKEY;

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
        let timestamp: i64 = clock::Clock::get()?.unix_timestamp; // todo fix - make it testable
        let transaction = Transaction {
            customer,
            timestamp,
            state: TransactionState::Initialized,
            store: DEFAULT_PUBKEY,
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
        require!(now <= self.timestamp + TRANSACTION_EXPIRATION_TIME_IN_SECONDS, TransactionErrors::TransactionExpired);
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

#[cfg(test)]
pub mod tests {
    use anchor_lang::{solana_program::pubkey::Pubkey, AnchorSerialize, Discriminator};
    use crate::{Transaction, TransactionAccount};

    #[test]
    fn it_works() {
        let customer_bytes: [u8; 32] = [1; 32];
        let customer_pubkey : Pubkey = Pubkey::new_from_array(customer_bytes);
        let discriminator = Transaction::discriminator(); 

        let serialized_transaction = 
            <anchor_lang::prelude::Account<'_, Transaction> as TransactionAccount>
            ::new_serialized_transaction(customer_pubkey);

        assert_eq!([11 ,24 ,174 ,129 ,203 ,117 ,242 ,23], discriminator);
        // assert_eq!(serialized_transaction[0..8], discriminator);
        // assert_eq!(serialized_transaction[9..9+32], customer_bytes);
    }
}