use crate::*;
use std::mem::size_of;

#[derive(Accounts)]
#[instruction(amount: u64, message: String)]
pub struct RequestPayment<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        realloc = 8 + size_of::<Transaction>() + message.len(), 
        realloc::payer=signer, 
        realloc::zero = false
    )]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

impl<'info> RequestPayment<'info> {
    pub fn process(&mut self, amount: u64, message: String) -> Result<()> {  
        let store = *self.signer.signer_key().unwrap();
        let _ = self.transaction.assign_store(store, amount, message);
        Ok(())
    }
}

#[error_code]
pub enum RequestPaymentErrors {
    #[msg("Invalid customer key")]
    InvalidCustomerKey,
    #[msg("Invalid store key")]
    InvalidStoreKey,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}