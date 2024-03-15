use crate::*;

#[derive(Accounts)]
pub struct InitializeCustomer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed, 
        payer=signer, 
        space = 8 + size_of::<Customer>(), 
        seeds=[SEED_CUSTOMER/* , signer.key().as_ref()*/], 
        bump)]
    pub customer: Account<'info, Customer>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeCustomer<'info> {
    pub fn process(&mut self) -> Result<()> {
        let InitializeCustomer { customer, .. } = self;
        customer.new()?;
        msg!("balance: {}", customer.balance);
        Ok(())
    }
}