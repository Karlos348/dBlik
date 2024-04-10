use crate::*;
use anchor_lang::solana_program::clock;

pub struct TimeProvider;

#[mockall::automock]
pub trait Time {
    fn get_timestamp(&self) -> i64;
}

impl Time for TimeProvider {
    fn get_timestamp(&self) -> i64  {
         clock::Clock::get().unwrap().unix_timestamp
    }
}