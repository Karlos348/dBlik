import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';

export function ConfirmButton() {
  const { transaction, confirm } = useTransaction();

  const handleSubmit = async (e: any) => {
    await confirm();
  };
  return (
    <>
      {transaction?.state === TransactionState.Pending
        ? <div><button onClick={handleSubmit}>confirm transaction</button></div>
        : <div></div>
        }
    </>
  );
}
