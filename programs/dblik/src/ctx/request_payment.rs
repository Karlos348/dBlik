use crate::*;
use self::consts::BASIC_TRANSACTION_SIZE;

#[derive(Accounts)]
#[instruction(amount: u64, message: String)]
pub struct RequestPayment<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        realloc = BASIC_TRANSACTION_SIZE + message.len(), 
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

        self.transaction.assign_store(*store.unwrap(), amount, message)
    }
}

#[error_code]
pub enum RequestPaymentErrors {
    #[msg("No store key")]
    NoStoreKey
}