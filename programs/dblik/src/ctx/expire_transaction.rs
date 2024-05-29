use crate::{consts::RETURNABLE_STORE_FEE, *};

#[derive(Accounts)]
pub struct ExpireTransaction<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub store: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> ExpireTransaction<'info> {
    pub fn process(&mut self) -> Result<()> {

        require!(self.signer.signer_key().is_some(), ExpireTransactionErrors::NoSignerKey);
        let caller = self.signer.key();

        require!(caller == self.transaction.store, ExpireTransactionErrors::NotAuthenticated);
        require!(self.store.key() == self.transaction.store, ExpireTransactionErrors::StoreKeyConflict);
        require!(self.transaction.state == TransactionState::Pending, ExpireTransactionErrors::InvalidTransactionState);

        let transaction_account_info = self.transaction.to_account_info();
        let store_account_info = self.store.to_account_info();

        **transaction_account_info.try_borrow_mut_lamports()? -= RETURNABLE_STORE_FEE;
        **store_account_info.try_borrow_mut_lamports()? += RETURNABLE_STORE_FEE;

        self.transaction.state = TransactionState::Expired;
        Ok(())
    }
}

#[error_code]
pub enum ExpireTransactionErrors {
    #[msg("No signer key")]
    NoSignerKey,
    #[msg("Not authenticated")]
    NotAuthenticated,
    #[msg("Invalid transaction state")]
    InvalidTransactionState,
    #[msg("Store key conflict")]
    StoreKeyConflict
}