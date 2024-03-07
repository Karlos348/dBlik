use anchor_lang::prelude::{borsh::{BorshDeserialize, BorshSerialize}, *};
use std::{collections::HashMap, time::SystemTime};

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        //ctx.accounts.transaction.customer = ctx.accounts.signer.key();
        //ctx.accounts.transaction.code = 123321 as u64;
        ctx.accounts.program_data.transactions = vec![ CodeReference { 
            code: 123321, 
            transaction: ctx.accounts.signer.key() 
        }];

        let init = &mut ctx.accounts.storage.load_init()?;
        init.authority = *ctx.accounts.signer.key;
        init.test = 348;

        Ok(())
    }

    pub fn just_logs(ctx: Context<Logs>) -> Result<()> {

        match ctx.accounts.program_data.transactions.get(0)
        {
            Some(value) => msg!("code: {}, pubkey: {}", value.code, value.transaction),
            None => msg!("nothing exists")
        };

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
    #[account(init, payer = signer, space = 24 + (200 * (8 + 32)))]
    pub program_data: Account<'info, ProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(zero)]
    pub storage: AccountLoader<'info, ProgramStorage>,
}

#[account(zero_copy)]
#[derive(Default)]
pub struct ProgramStorage {
    pub authority: Pubkey,
    pub test : u64
}

#[account]
#[derive(Default)]
pub struct ProgramData {
    transactions: Vec<CodeReference>
}

#[account]
#[derive(Default)]
pub struct Transaction {
    customer: Pubkey,
    shop: Pubkey,
    code: u64
}

#[derive(Default, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CodeReference {
    code: u64,
    transaction: Pubkey
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub transaction: Account<'info, Transaction>
}

#[derive(Accounts)]
pub struct Logs<'info> {
    #[account(mut)]
    pub program_data: Account<'info, ProgramData>
}

#[error_code]
pub enum Errors {
    #[msg("Invalid code")]
    InvalidCode
}