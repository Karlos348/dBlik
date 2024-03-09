use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {

    use super::*;

    pub fn initialize(ctx: Context<Run>) -> Result<()> {
        //ctx.accounts.program_data.timestamp = Utc::now().timestamp_millis();
        let lamports = (Rent::get()?).minimum_balance(200);
        anchor_lang::system_program::create_account(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::CreateAccount {
                    from: ctx.accounts.signer.to_account_info(),
                    to: ctx.accounts.storage_account.to_account_info(),
                },
            ),
            lamports,
            200, // space
            &ctx.accounts.system_program.key(), // owner
        )?;
        
        Ok(())
    }

    pub fn run_zk(ctx: Context<RunZeroCopy>) -> Result<()> {
        //let data = &mut ctx.accounts.program_data.load_mut()?;
        //for n in 0..5242880 {
        //}

        //data.string_5mb[0] = b'a';
        Ok(())
    }

    pub fn update_zk(ctx: Context<UpdateZeroCopyData>, string_to_replace: String, replace_at: usize) -> Result<()> {
        let to_replace = std::str::from_utf8(string_to_replace.as_bytes()).unwrap();
        msg!(to_replace);
        let len = to_replace.len();

        ctx.accounts
            .zc_data
            .load_mut()?
            .string_5mb[replace_at..(replace_at + len) as usize]
            .copy_from_slice(to_replace.as_bytes());

        Ok(())
    }

    pub fn just_logs(ctx: Context<Logs>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Run<'info> {
    #[account(init, payer = signer, space = 500)]
    pub program_data: Account<'info, ProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub storage_account: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Logs<'info> {
    #[account(mut)]
    pub program_data: Account<'info, ProgramData>
}

#[account]
#[derive(Default)]
pub struct ProgramData {
    pub timestamp : i64
}

#[account(zero_copy)]
#[repr(C)]
pub struct ZeroCopyData {
    pub string_5mb: [u8; 5242880],
}

#[derive(Accounts)]
#[instruction(len: u16)]
pub struct RunZeroCopy<'info> {
    #[account(init, 
        seeds = [b"run_zero_copy_v0", 
        signer.key().as_ref()], 
        bump, 
        payer=signer, 
        space= 10 * 1024 as usize)]
    pub program_data: AccountLoader<'info, ZeroCopyData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdateZeroCopyData<'info> {
    #[account(mut)]
    pub zc_data: AccountLoader<'info, ZeroCopyData>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

pub struct Transaction {
    timestamp: i64,
    customer: Option<Pubkey>,
    shop: Pubkey,
    code: u64
}

#[error_code]
pub enum Errors {
    #[msg("Invalid code")]
    InvalidCode
}