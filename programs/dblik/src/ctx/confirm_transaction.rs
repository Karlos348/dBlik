use anchor_lang::solana_program::system_instruction;

use crate::*;
use std::mem::size_of;

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

        if self.signer.key() != self.transaction.customer
        {
            msg!("invalid customer key");
            return Ok(())
        }

        if self.store.key() != self.transaction.store
        {
            msg!("invalid store key");
            return Ok(())
        }

        if self.signer.lamports() < self.transaction.amount
        {
            msg!("insufficient balance");
            return Ok(())
        }

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
