use crate::*;
use anchor_lang::solana_program::system_instruction;

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

        let transfer_instruction = system_instruction::transfer(
            &self.transaction.customer,
            &self.transaction.store,
            self.transaction.amount);

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                self.signer.to_account_info(),
                self.store.to_account_info()
            ],
            &[],
        )?;

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