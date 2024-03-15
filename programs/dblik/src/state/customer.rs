use crate::*;

pub const SEED_CUSTOMER: &[u8] = b"customer";

#[account]
pub struct Customer {
    pub balance: u64
}

impl Customer {
    pub fn pda(payer: Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[SEED_CUSTOMER/* , payer.as_ref()*/], &crate::ID)
    }
}

pub trait CustomerAccount {
    fn new(&mut self) -> Result<()>;
}

impl CustomerAccount for Account<'_, Customer> {
    fn new(&mut self) -> Result<()> {
        self.balance = 11;
        anchor_lang::solana_program::log::sol_log(&self.get_lamports().to_string());
        Ok(())
    }
}
