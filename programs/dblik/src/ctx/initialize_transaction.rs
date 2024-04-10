use crate::{consts::BASIC_TRANSACTION_SIZE, *};

#[derive(Accounts)]
pub struct InitializeTransaction<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: todo
    #[account(mut)]
    pub transaction: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeTransaction<'info> {
    pub fn process(&mut self) -> Result<()> {
        let mut account_data = self.transaction.try_borrow_mut_data()?;
        require!(account_data.len() == BASIC_TRANSACTION_SIZE, InitializeTransactionErrors::ImproperlyCreatedAccount);
        require!(account_data.iter().all(|&x| x == 0), InitializeTransactionErrors::TransactionAlreadyInitialized);

        let customer = self.signer.signer_key();
        require!(customer.is_some(), InitializeTransactionErrors::NoCustomerKey);

        let serialized_transaction = <anchor_lang::prelude::Account<'_, state::transaction::Transaction> as TransactionAccount>::new_serialized_transaction(*customer.unwrap(), TimeProvider)?;

        require!(serialized_transaction.len() <= account_data.len(), InitializeTransactionErrors::ImproperlyCreatedAccount);
        account_data[0..serialized_transaction.len()].copy_from_slice(&serialized_transaction[0..serialized_transaction.len()]);
        Ok(())
    }
}

#[error_code]
pub enum InitializeTransactionErrors {
    #[msg("Improperly created account")]
    ImproperlyCreatedAccount,
    #[msg("Transaction already initialized")]
    TransactionAlreadyInitialized,
    #[msg("No customer key")]
    NoCustomerKey,
}