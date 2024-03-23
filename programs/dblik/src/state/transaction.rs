use crate::*;

#[account]
pub struct Transaction {
    pub customer: Pubkey,
    pub timestamp: i64,
    pub state: TransactionState,
    pub store: Pubkey,
    pub amount: u64,
    pub message: String
}

pub trait TransactionAccount {
    fn new(&mut self) -> Result<()>;
}

impl TransactionAccount for Account<'_, Transaction> {
    fn new(&mut self) -> Result<()> {
        // todo
        Ok(())
    }
}
