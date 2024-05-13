import { useTransaction } from '@/contexts/TransactionContext';
import { useState } from 'react';

export function CodeForm() {
  const [code, setCode] = useState('');
  const transaction = useTransaction();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    transaction.requestPayment(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
      <button type="submit">Send payment request</button>
    </form>
  );
}
