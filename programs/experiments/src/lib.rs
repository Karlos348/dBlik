use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use std::mem::size_of;
use anchor_lang::Discriminator;

declare_id!("7Vo3RPXvCm7BNgUeHHdYmvMSUUvaWWpyQ6MjiJrpfgFy");

#[program]
pub mod experiments {
    use anchor_lang::{accounts::{self, account, signer}, solana_program::system_program};

    use super::*;

    pub fn with_seed(ctx: Context<Seeds>) -> Result<()> {
        Ok(())
    }

    pub fn use_seeded_account(ctx: Context<UseSeededAccount>) -> Result<()> {
        ctx.accounts.account.tst = Some(true);
        Ok(())
    }

    pub fn standard(ctx: Context<Standard>) -> Result<()> {
        Ok(())
    }

    pub fn create_large_account(ctx: Context<CreateLargeAccount>) -> Result<()> {
        Ok(())
    }

    pub fn large(ctx: Context<Large>) -> Result<()> {
        Ok(())
    }

    pub fn activate_manual(ctx: Context<ActivateManualAccount>) -> Result<()> {
        let acc: ManualAccount = ManualAccount {
            activated: true,
            used_by: *ctx.accounts.signer.signer_key().unwrap()
        };

        let acc_vec = acc.try_to_vec().unwrap();

        let mut mut_acc = (&mut ctx.accounts.account).try_borrow_mut_data()?;
        
        mut_acc[0..8].copy_from_slice(&ManualAccount::discriminator()[0..8]);
        mut_acc[8..acc_vec.len()+8].copy_from_slice(&acc_vec[0..acc_vec.len()]);

        Ok(())
    }

    pub fn use_manual(ctx: Context<UseManualAccount>) -> Result<()> {
       msg!("used_by before: {}", ctx.accounts.account.used_by.to_string());
       ctx.accounts.account.used_by = *ctx.accounts.signer.signer_key().unwrap();
       msg!("used_by after: {}", ctx.accounts.account.used_by.to_string());
       Ok(())
    }
}

#[derive(Accounts)]
pub struct ActivateManualAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: todo
    #[account(mut)]
    pub account: AccountInfo<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UseManualAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub account: Account<'info, ManualAccount>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct ManualAccount {
    pub activated : bool,
    pub used_by: Pubkey
}

#[derive(Accounts)]
pub struct UseSeededAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed, 
        payer=signer, 
        space = 8 + size_of::<SeededAccountData>())]
    pub account: Account<'info, SeededAccountData>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct SeededAccountData {
    pub tst : Option<bool>
}

#[derive(Accounts)]
//#[instruction(...)]
pub struct Seeds<'info> {
    #[account(init_if_needed, payer = signer, seeds = [b"seed"], bump, space = 100)]
    pub program_data: Account<'info, ProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Standard<'info> {
    #[account(init, payer = signer, space = 8)]
    pub program_data: Account<'info, ProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateLargeAccount<'info> {
    //#[account(init_if_needed, payer=signer, seeds=[signer.key().as_ref()], bump, space = 150000)]
    //#[account(zero, seeds=[signer.key().as_ref()], bump)]
    // #[account(mut,
    //     realloc = 150000,
    //     realloc::payer = signer,
    //     realloc::zero = false, 
    //     seeds=[signer.key().as_ref()], 
    //     bump)]
    pub program_data: AccountLoader<'info, LargeProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Large<'info> {
    #[account(zero)]
    pub program_data: AccountLoader<'info, LargeProgramData>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account(zero_copy)]
#[derive(Default)]
pub struct LargeProgramData {
}

#[account]
#[derive(Default)]
pub struct ProgramData {
}
