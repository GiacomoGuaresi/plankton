import React, { useState } from 'react';

export default function ConfigTable({ chain }) {
  const [localChain, setLocalChain] = useState(chain);

  const allKeys = Array.from(
    new Set(localChain.flatMap(entry => Object.keys(entry.data).filter(k => k !== 'inherits')))
  );

  const handleChange = (fileIndex, key, value) => {
    const updatedChain = [...localChain];
    updatedChain[fileIndex] = {
      ...updatedChain[fileIndex],
      data: {
        ...updatedChain[fileIndex].data,
        [key]: value
      }
    };
    setLocalChain(updatedChain);
  };

  const renderInput = (value, fileIndex, key) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value ?? '';

    return (
      <input
        type="text"
        value={stringValue}
        onChange={e => handleChange(fileIndex, key, e.target.value)}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Chiave</th>
          {localChain.map(entry => (
            <th key={entry.file}>{entry.file}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allKeys.map(key => (
          <tr key={key}>
            <td>{key}</td>
            {localChain.map((entry, fileIndex) => (
              <td key={entry.file + key}>
                {renderInput(entry.data[key], fileIndex, key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
