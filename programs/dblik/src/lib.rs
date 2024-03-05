use anchor_lang::prelude::*;
use std::{collections::HashMap, time::SystemTime};

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        //ctx.accounts.transaction.customer = ctx.accounts.signer.key();
        //ctx.accounts.transaction.code = 123321 as u64;
        ctx.accounts.program_data.transactions = HashMap::new();
        ctx.accounts.program_data.transactions.insert(123321 as u64, ctx.accounts.signer.key());

        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, data: u64) -> Result<()> {
        //require!(data >= 100000 && data <= 999999, Errors::InvalidCode);
        //ctx.accounts.transaction.code = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 384 + (10000 * (64 + 32)))]
    pub program_data: Account<'info, ProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct ProgramData {
    transactions: HashMap<u64, Pubkey> // not supported?
}

#[account]
#[derive(Default)]
pub struct Transaction {
    customer: Pubkey,
    shop: Pubkey,
    code: u64
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub transaction: Account<'info, Transaction>
}

#[error_code]
pub enum Errors {
    #[msg("Invalid code")]
    InvalidCode
}