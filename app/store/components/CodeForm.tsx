import { useEffect, useState } from 'react';
import Image from 'next/image'
import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';

export function CodeForm() {
  const [code, setCode] = useState('');
  const [checkingCode, setCheckingCode] = useState<boolean>(false);
  const {product, transaction, requestPayment, error} = useTransaction();

  const handleSubmit = async (e: any) => {
    setCheckingCode(true);
    e.preventDefault();
    await requestPayment(code)
    setCode('')
  };

  useEffect(() => {
    setCheckingCode(false);
  }, [product, error])

  if(error !== undefined) {
    return (<div className="w-96 flex mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
    <div className="flex-2 items-center justify-center">
      <Image
        className="relative"
        src="/logo.png"
        alt="dBlik"
        width={100}
        height={100}
        priority
      />
    </div>
    <div className="flex-1 flex ml-6 items-center justify-center">
      <h2 className="text-xl uppercase tracking-widest text-center">{error}</h2>
    </div>
  </div>)
  }

  if(checkingCode && transaction === undefined) {
    return (<div className="w-96 flex mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
    <div className="flex-2 items-center justify-center">
      <Image
        className="relative"
        src="/logo.png"
        alt="dBlik"
        width={100}
        height={100}
        priority
      />
    </div>
    <div className="flex-1 flex ml-6 items-center justify-center">
      <h2 className="text-xl uppercase tracking-widest text-center">Checking code...</h2>
    </div>
  </div>)
  }

  if(product === undefined) {
    return <></>
  }

  if(transaction === undefined) {
    return <div className="container">

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
          </div>
        </button>
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

  .button-container:hover {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
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
  </div>
  }


  switch (transaction.state) {
    case TransactionState.Canceled:
    case TransactionState.Timeout:
      return (
        <div className="w-96 flex mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
          <div className="flex-2 items-center justify-center">
            <Image
              className="relative"
              src="/logo.png"
              alt="dBlik"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="flex-1 flex ml-6 items-center justify-center">
            <h2 className="text-xl uppercase tracking-widest text-center">Transaction canceled</h2>
          </div>
        </div>
      );

    case TransactionState.Pending:
      return (
        <div className="w-96 flex mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
          <div className="flex-2 items-center justify-center">
            <Image
              className="relative"
              src="/logo.png"
              alt="dBlik"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="flex-1 flex ml-6 items-center justify-center">
            <h2 className="text-xl uppercase tracking-widest text-center">Waiting for payment confirmation</h2>
          </div>
        </div>
      );

    case TransactionState.Succeed:
      return (
      <div className="w-96 flex mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
          <div className="flex-2 items-center justify-center">
            <Image
              className="relative"
              src="/logo.png"
              alt="dBlik"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="flex-1 flex ml-6 items-center justify-center">
            <h2 className="text-xl uppercase tracking-widest text-center">Transaction completed successfully</h2>
          </div>
        </div>
      );

    default:
      return <></>
  }
}
