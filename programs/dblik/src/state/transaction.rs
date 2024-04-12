use crate::consts::TRANSACTION_EXPIRATION_TIME_IN_SECONDS;
use crate::*;
use anchor_lang::Discriminator;
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
    fn new_serialized_transaction(customer: Pubkey, time_provider: impl Time) -> Result<Vec<u8>>;
    fn assign_store(&mut self, time_provider: impl Time, store: Pubkey, amount: u64, message: String) -> Result<()>;
}

impl TransactionAccount for Account<'_, Transaction> {
    fn new_serialized_transaction(customer: Pubkey, time_provider: impl Time) -> Result<Vec<u8>> {
        let discriminator = Transaction::discriminator();
        let timestamp = time_provider.get_timestamp();
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
    
    fn assign_store(&mut self, time_provider: impl Time, store: Pubkey, amount: u64, message: String) -> Result<()> {

        let now = time_provider.get_timestamp();
        require!(now <= self.timestamp + TRANSACTION_EXPIRATION_TIME_IN_SECONDS, TransactionErrors::TransactionExpired);
        if now > self.timestamp + TRANSACTION_EXPIRATION_TIME_IN_SECONDS
        {
            self.state = TransactionState::Expired;
            return err!(TransactionErrors::TransactionExpired);
        }

        require!(self.state == TransactionState::Initialized, TransactionErrors::InvalidTransactionState);
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
    use anchor_lang::{solana_program::pubkey::Pubkey, Discriminator};
    use crate::{consts::DEFAULT_PUBKEY, MockTime, Transaction, TransactionAccount};

    #[test]
    fn test_new_serialized_transaction_data_correctness() {
        let customer_bytes: [u8; 32] = [1; 32];
        let customer_pubkey : Pubkey = Pubkey::new_from_array(customer_bytes);
        let discriminator = Transaction::discriminator(); 
        let mut time_mock = MockTime::new();
        time_mock.expect_get_timestamp().returning(|| i64::MAX);

        let serialized_transaction = 
            <anchor_lang::prelude::Account<'_, Transaction> as TransactionAccount>
            ::new_serialized_transaction(customer_pubkey, time_mock);

        assert!(serialized_transaction.is_ok());

        let serialized_transaction = serialized_transaction.unwrap();

        assert_eq!(discriminator, serialized_transaction[0..8]); // discriminator
        assert_eq!(customer_bytes, serialized_transaction[8..8+32]); // customer
        assert_eq!(i64::MAX.to_le_bytes(), serialized_transaction[8+32..8+32+8]); // timestamp
        assert_eq!([0], serialized_transaction[8+32+8..8+32+8+1]); // state
        assert_eq!(DEFAULT_PUBKEY.to_bytes(), serialized_transaction[8+32+8+1..8+32+8+1+32]); // store
        assert_eq!([0; 8], serialized_transaction[8+32+8+1+32..8+32+8+1+32+8]); // amount
        assert_eq!([0; 4], serialized_transaction[8+32+8+1+32+8..]); // message
    }
}