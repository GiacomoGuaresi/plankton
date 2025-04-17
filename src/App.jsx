import React, { useState } from 'react';
import ConfigTable from './components/ConfigTable';
import { Document24Regular, Checkmark24Regular, SaveEdit24Regular } from '@fluentui/react-icons';

export default function App() {
  const [chain, setChain] = useState([]);

  const handleLoad = async () => {
    const file = await window.api.openJsonFile();
    if (!file) return;
    const data = await window.api.loadConfigChain(file);
    setChain(data);
  };

  return (
    <>
      <div className="navbar">

        <button onClick={handleLoad}><Document24Regular style={{ color: 'white', marginBottom: '-0.4rem', height: 'min-content', marginRight: '0.5rem'}} />Open</button>
        <button><Checkmark24Regular style={{ color: 'white', marginBottom: '-0.4rem', height: 'min-content', marginRight: '0.5rem'}} />Check [WIP]</button>
        <button><SaveEdit24Regular style={{ color: 'white', marginBottom: '-0.4rem', height: 'min-content', marginRight: '0.5rem'}} />Save [WIP]</button>
      </div>
      {chain.length > 0 && <ConfigTable chain={chain} />}
    </>
  );
}
