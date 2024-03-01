use anchor_lang::prelude::*;

declare_id!("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

#[program]
pub mod dblik {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
