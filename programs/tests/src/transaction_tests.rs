#[cfg(test)]
pub mod transacton_tests {
    use anchor_lang::{solana_program::pubkey::Pubkey, AnchorSerialize, Discriminator};
    use dblik::{Transaction, TransactionAccount};
    use std::str::FromStr;

    #[test]
    fn it_works() {
        let customer_bytes: [u8; 32] = [1; 32];
        let customer_pubkey : Pubkey = Pubkey::new_from_array(customer_bytes);
        let discriminator = Transaction::discriminator(); 

        let serialized_transaction = 
            <anchor_lang::prelude::Account<'_, dblik::Transaction> as TransactionAccount>
            ::new_serialized_transaction(customer_pubkey);

        assert_eq!([11 ,24 ,174 ,129 ,203 ,117 ,242 ,23], discriminator);
        // assert_eq!(serialized_transaction[0..8], discriminator);
        // assert_eq!(serialized_transaction[9..9+32], customer_bytes);
    }
}