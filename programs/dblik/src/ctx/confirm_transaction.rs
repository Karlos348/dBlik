use crate::*;
use anchor_lang::solana_program::{program, system_instruction};

#[derive(Accounts)]
pub struct ConfirmTransaction<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub store: SystemAccount<'info>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

impl<'info> ConfirmTransaction<'info> {
    pub fn process(&mut self) -> Result<()> {
        require!(self.signer.key() == self.transaction.customer, ConfirmTransactionErrors::CustomerKeyConflict);
        require!(self.store.key() == self.transaction.store, ConfirmTransactionErrors::StoreKeyConflict);
        require!(self.signer.lamports() >= self.transaction.amount, ConfirmTransactionErrors::InsufficientBalance);

        let store_account_info = self.store.to_account_info();
        let customer_account_info = self.signer.to_account_info();

        let transfer_instruction = system_instruction::transfer(
            &self.transaction.customer,
            &self.transaction.store,
            self.transaction.amount);

        program::invoke_signed(
            &transfer_instruction,
            &[
                customer_account_info,
                store_account_info
            ],
            &[],
        )?;

        let amount = self.transaction.get_lamports();
        let transaction_account_info = self.transaction.to_account_info();
        let customer_account_info = self.signer.to_account_info();

        **transaction_account_info.try_borrow_mut_lamports()? -= amount;
        **customer_account_info.try_borrow_mut_lamports()? += amount;

        self.transaction.state = TransactionState::Succeed;
        Ok(())
    }
}

#[error_code]
pub enum ConfirmTransactionErrors {
    #[msg("Customer key conflict")]
    CustomerKeyConflict,
    #[msg("Store key conflict")]
    StoreKeyConflict,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}