use crate::*;

#[derive(Accounts)]
pub struct ClearTransactionAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

impl<'info> ClearTransactionAccount<'info> {
    pub fn process(&mut self) -> Result<()> {

        require!(self.signer.signer_key().is_some(), ClearTransactionAccountErrors::NoSignerKey);
        let caller = self.signer.key();

        require!(caller == self.transaction.customer, ClearTransactionAccountErrors::NotAuthenticated);

        let available_states = 
        [
            TransactionState::Canceled,
            TransactionState::Expired,
            TransactionState::Succeed
        ];
        require!(available_states.contains(&self.transaction.state), ClearTransactionAccountErrors::InvalidTransactionState);

        let amount = self.transaction.get_lamports();
        let transaction_account_info = self.transaction.to_account_info();
        let customer_account_info = self.signer.to_account_info();

        **transaction_account_info.try_borrow_mut_lamports()? -= amount;
        **customer_account_info.try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

#[error_code]
pub enum ClearTransactionAccountErrors {
    #[msg("No signer key")]
    NoSignerKey,
    #[msg("Not authenticated")]
    NotAuthenticated,
    #[msg("Invalid transaction state")]
    InvalidTransactionState
}