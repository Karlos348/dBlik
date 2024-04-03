use anchor_lang::solana_program::pubkey::Pubkey;

pub const FREE_TRANSACTION_MESSAGE_SIZE: usize = 10;
pub const BASIC_TRANSACTION_SIZE: usize = 93 + FREE_TRANSACTION_MESSAGE_SIZE;
pub const TRANSACTION_EXPIRATION_TIME_IN_SECONDS: i64 = 120;
pub const DEFAULT_PUBKEY : Pubkey = Pubkey::new_from_array([0; 32]);