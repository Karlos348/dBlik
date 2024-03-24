use crate::*;
use crate::state::transaction::TransactionAccount;

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

        let discriminator = TransactionAccount::discriminator;
        let data = (discriminator, /* todo */);
        //data.serialize(&mut *ctx.accounts.account.try_borrow_mut_data()?)?;

        Ok(())
    }
}