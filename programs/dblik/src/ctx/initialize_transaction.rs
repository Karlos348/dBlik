use anchor_lang::Discriminator;

use crate::*;

#[derive(Accounts)]
pub struct InitializeTransaction<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: todo
    #[account(mut)]
    pub account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeTransaction<'info> {
    pub fn process(&mut self) -> Result<()> {
        
        Ok(())
    }
}