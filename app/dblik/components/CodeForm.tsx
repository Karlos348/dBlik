import { useState } from 'react';

export function CodeForm() {
  const [code, setCode] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
      <button type="submit">Send payment request</button>
    </form>
  );
}
