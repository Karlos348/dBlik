import { useTransaction } from '@/contexts/TransactionContext';
import { useState } from 'react';
import Image from 'next/image'

export function CodeForm() {
  const [code, setCode] = useState('');
  const transaction = useTransaction();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setCode(code);
    //transaction.requestPayment(code);
  };

  return (
    <div className="">
      <div>
          <Image
          className="relative"
          src="/logo.png"
          alt="dBlik"
          width={75}
          height={75}
          priority
          />
      </div>
      <div>
        <p>{code}</p>
        <form onSubmit={handleSubmit}>
          <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
          <button type="submit">Send payment request</button>
        </form>
      </div>
    </div>
  );
}
