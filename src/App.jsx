import React, { useState } from 'react';
import ConfigTable from './components/ConfigTable';

export default function App() {
  const [chain, setChain] = useState([]);

  const handleLoad = async () => {
    const file = await window.api.openJsonFile();
    if (!file) return;
    const data = await window.api.loadConfigChain(file);
    setChain(data);
  };

  return (
    <div>
      <button onClick={handleLoad}>Apri file JSON</button>
      {chain.length > 0 && <ConfigTable chain={chain} />}
    </div>
  );
}
