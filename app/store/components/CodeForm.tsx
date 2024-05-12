import { useTransaction } from '@/contexts/TransactionContext';
import { useState } from 'react';

export function CodeForm() {
  const [code, setCode] = useState('');
  const transactionCtx = useTransaction();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    transactionCtx.code = Number(code);
    console.log('code '+ code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
      <button type="submit">Send payment request</button>
    </form>
  );
}
