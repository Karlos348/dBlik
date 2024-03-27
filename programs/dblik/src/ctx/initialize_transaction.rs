use crate::*;

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
        let customer = self.signer.key();
        let serialized_transaction = <anchor_lang::prelude::Account<'_, state::transaction::Transaction> as TransactionAccount>::new_serialized_transaction(customer)?;
        let mut account_data = self.transaction.try_borrow_mut_data()?;
        
        account_data[0..serialized_transaction.len()].copy_from_slice(&serialized_transaction[0..serialized_transaction.len()]);
        Ok(())
    }
}