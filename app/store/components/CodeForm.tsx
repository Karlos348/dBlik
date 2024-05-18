import { useTransaction } from '@/contexts/TransactionContext';
import { useState } from 'react';
import Image from 'next/image'
import { requestPayment } from '@/clients/transaction_client';

export function CodeForm() {
  const [code, setCode] = useState('');
  const transaction = useTransaction();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setCode(code);
    const tx = await requestPayment(Number(code), transaction.product?.price ?? 0, transaction.product?.name ?? '');
    console.log('[request payment] tx: ' + tx);
  };

  return (
    <>
      {transaction.product === null
        ? <div></div>
        :
        <div className="container">

          <div>
            <form onSubmit={handleSubmit} className='codeForm'>
            <input type="number" placeholder="_ _ _ _ _ _" name="code" value={code} onChange={e => setCode(e.target.value)} min="100000" max="999999"/>
              <button type="submit">
                <div className="button-container">
                  <div className="logo">
                    <Image
                      className="relative"
                      src="/logo.png"
                      alt="dBlik"
                      width={50}
                      height={50}
                      priority
                    />
                  </div>
                  <div className="button-text">PAY</div>
                </div></button>
            </form>
          </div>


          <style jsx>{`

        .button-container {
          display: flex;
          align-items: center;
          background-color: transparent;
          border: 1px solid #ccc;
          border-radius: 11px;
          overflow: hidden;
          width: fit-content;
        }

        .logo {
          background-color: transparent;
          padding: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          min-height: 50px;
          min-width: 50px;
        }

        .button-text {
          font-size: 24px;
          margin-right: 20px;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
        }

        .codeForm {
          display: flex;
          align-items: center;
          height: 50px;
          margin-right: 20px;
          font-size: 30px;
          margin-left: 20px;
        }

        .codeForm input {
          margin-right: 10px;
          height: 50px;
          display: flex;
          align-items: center;
          background-color: transparent;
          border: 1px solid #ccc;
          border-radius: 11px;
          overflow: hidden;
          width: 200px;
          text-align: center;
        }

        .codeForm input::placeholder {
          text-align: center;
          color: grey;
        }
      
      `}</style>
        </div>}
    </>
  );
}
