import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function IncomingTransactionBox() {
  const { transaction, confirm, cancel } = useTransaction();

  const handleConfirm = async (e: any) => {
    await confirm();
  };

  const handleCancel = async (e: any) => {
    await cancel();
  };


  const amount = Number(transaction?.amount) / LAMPORTS_PER_SOL;

  return (
    <>
      {transaction?.state === TransactionState.Pending
        ? <div className="box w-96 mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
        <h2 className="text-xl uppercase tracking-widest mb-4 text-center">Incoming Transaction</h2>
        <p className="text-lg mb-2">Message: {transaction?.message}</p>
        <p className="text-lg mb-4">Amount: {amount} SOL</p>
        <div className="flex justify-around mt-6">
            <button
                onClick={handleCancel}
                className="mr-2 flex items-center justify-center w-44 h-12 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 transition-shadow duration-250"
            >
                <span className="uppercase">Cancel</span>
            </button>
            <button
                onClick={handleConfirm}
                className="ml-2 flex items-center justify-center w-44 h-12 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 transition-shadow duration-250"
            >
                <span className="uppercase">Confirm</span>
            </button>
        </div>
        <style jsx>{`
            .box {
                box-shadow: -15px -15px 50px rgba(255, 105, 180, 0.3), 
                            15px 15px 50px rgba(0, 255, 200, 0.3);
                transition: box-shadow 0.25s ease;
            }
        `}</style>
    </div>
        : <div></div>
        }
    </>
  );
}
