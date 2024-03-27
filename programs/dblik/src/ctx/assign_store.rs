use crate::*;
use std::mem::size_of;

#[derive(Accounts)]
#[instruction(amount: u64, message: String)]
pub struct AssignStore<'info> {
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

impl<'info> AssignStore<'info> {
    pub fn process(&mut self, amount: u64, message: String) -> Result<()> {  
        let store = *self.signer.signer_key().unwrap();
        let _ = self.transaction.assign_store(store, amount, message);
        Ok(())
    }
}
