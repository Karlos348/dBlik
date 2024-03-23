use crate::*;

#[derive(Copy, Clone, Debug, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum TransactionState {
    Initialized,
    Pending,
    Succeed
}