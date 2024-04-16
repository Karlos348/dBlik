use crate::*;
use self::consts::{BASIC_TRANSACTION_SIZE, FREE_TRANSACTION_MESSAGE_SIZE, RETURNABLE_STORE_FEE};

#[derive(Accounts)]
#[instruction(amount: u64, message: String)]
pub struct RequestPayment<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        realloc = if message.len() > FREE_TRANSACTION_MESSAGE_SIZE { 
            BASIC_TRANSACTION_SIZE - FREE_TRANSACTION_MESSAGE_SIZE + message.len() 
        } else { 
            BASIC_TRANSACTION_SIZE 
        }, 
        realloc::payer=signer, 
        realloc::zero = false
    )]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

impl<'info> RequestPayment<'info> {
    pub fn process(&mut self, amount: u64, message: String) -> Result<()> {  
        let store = self.signer.signer_key();
        require!(store.is_some(), RequestPaymentErrors::NoStoreKey);

        let transaction_account_info = self.transaction.to_account_info();
        let store_account_info = self.signer.to_account_info();

        **store_account_info.try_borrow_mut_lamports()? -= RETURNABLE_STORE_FEE;
        **transaction_account_info.try_borrow_mut_lamports()? += RETURNABLE_STORE_FEE;

        self.transaction.assign_store(TimeProvider, *store.unwrap(), amount, message)
    }
}

#[error_code]
pub enum RequestPaymentErrors {
    #[msg("No store key")]
    NoStoreKey
}