use anchor_lang::solana_program::pubkey::Pubkey;

pub const BASIC_TRANSACTION_SIZE: usize = 93;
pub const TRANSACTION_EXPIRATION_TIME_IN_SECONDS: i64 = 120;
pub const DEFAULT_PUBKEY : Pubkey = Pubkey::new_from_array([0; 32]);