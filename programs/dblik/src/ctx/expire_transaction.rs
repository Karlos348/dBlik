use crate::*;

#[derive(Accounts)]
pub struct ExpireTransaction<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

impl<'info> ExpireTransaction<'info> {
    pub fn process(&mut self) -> Result<()> {

        require!(self.signer.signer_key().is_some(), ExpireTransactionErrors::NoSignerKey);
        let caller = self.signer.key();

        require!(caller == self.transaction.store, ExpireTransactionErrors::NotAuthenticated);
        require!(self.transaction.state == TransactionState::Pending, ExpireTransactionErrors::InvalidTransactionState);

        let amount = self.transaction.get_lamports();
        let transaction_account_info = self.transaction.to_account_info();
        let customer_account_info = self.signer.to_account_info();

        **transaction_account_info.try_borrow_mut_lamports()? -= amount;
        **customer_account_info.try_borrow_mut_lamports()? += amount;

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
    InvalidTransactionState
}