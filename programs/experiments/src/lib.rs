use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_lang::Discriminator;

declare_id!("7Vo3RPXvCm7BNgUeHHdYmvMSUUvaWWpyQ6MjiJrpfgFy");

#[program]
pub mod experiments {

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
        let acc = ManualAccount {
            activated: true,
            created_by: *ctx.accounts.signer.signer_key().unwrap(), 
            updated_by: None,
            message: String::new()
        };
        let discriminator = ManualAccount::discriminator();
        let data = (discriminator, acc.clone());
        data.serialize(&mut *ctx.accounts.account.try_borrow_mut_data()?)?;
        Ok(())
    }

    pub fn use_manual(ctx: Context<UseManualAccount>) -> Result<()> {
        msg!("created_by: {}", ctx.accounts.account.created_by.to_string());

        match ctx.accounts.account.updated_by 
        {
            Some(value) => msg!("updated_by before: {}", value.to_string()),
            None => msg!("updated_by before: none") 
        }
        ctx.accounts.account.updated_by = Some(*ctx.accounts.signer.signer_key().unwrap());
        msg!("updated_by after: {}", ctx.accounts.account.updated_by.unwrap().to_string());
        Ok(())
    }

    pub fn realloc_manual(ctx: Context<ReallocManualAccount>, message: String) -> Result<()> {
        ctx.accounts.account.updated_by = Some(*ctx.accounts.signer.signer_key().unwrap());
        ctx.accounts.account.message = message;
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

#[derive(Accounts)]
#[instruction(message: String)]
pub struct ReallocManualAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        realloc = 8+32+1+32+5+message.len()*1, realloc::payer=signer, realloc::zero = false
    )]
    pub account: Account<'info, ManualAccount>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct ManualAccount {
    pub activated : bool,
    pub created_by: Pubkey,
    pub updated_by: Option<Pubkey>,
    pub message: String
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
