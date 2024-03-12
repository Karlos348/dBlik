use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

declare_id!("7Vo3RPXvCm7BNgUeHHdYmvMSUUvaWWpyQ6MjiJrpfgFy");

#[program]
pub mod experiments {
    use super::*;

    pub fn with_seed(ctx: Context<Seeds>) -> Result<()> {
        
        Ok(())
    }

    pub fn standard(ctx: Context<Standard>) -> Result<()> {
        Ok(())
    }

    pub fn create_large_account(ctx: Context<CreateLargeAccount>) -> Result<()> {
        
        // let from = ctx.accounts.signer.key;
        // let to = &ctx.accounts.program_data.key();
        // let instruction: anchor_lang::solana_program::instruction::Instruction =  system_instruction::
        // create_account(from, to, (Rent::get()?).minimum_balance(150000), 150000, ctx.program_id);

        // anchor_lang::solana_program::program::invoke_signed(
        //     &instruction,
        //     &[
        //         ctx.accounts.program_data.to_account_info().clone(),
        //         ctx.accounts.signer.to_account_info().clone()
        //     ],
        //     &[],
        // )?;

        Ok(())
    }

    pub fn large(ctx: Context<Large>) -> Result<()> {
        // let from_account = &ctx.accounts.program_data.key();
        // let to_account = &ctx.accounts.signer.key;

        // let transfer_instruction = system_instruction::transfer(from_account, to_account, ctx.accounts.program_data.get_lamports());

        // anchor_lang::solana_program::program::invoke_signed(
        //     &transfer_instruction,
        //     &[
        //         ctx.accounts.program_data.to_account_info(),
        //         ctx.accounts.signer.to_account_info(),
        //         ctx.accounts.system_program.to_account_info(),
        //     ],
        //     &[],
        // )?;
        Ok(())
    }
}

#[derive(Accounts)]
//#[instruction(...)]
pub struct Seeds<'info> {
    #[account(init_if_needed, payer = signer, seeds = [b"seed"], bump, space = 150)]
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
