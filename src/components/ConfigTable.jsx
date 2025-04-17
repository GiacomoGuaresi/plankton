import React, { useState } from 'react';
import './ConfigTable.css'; // Import your CSS file for styling
import { Eye12Regular } from '@fluentui/react-icons';
import ModalEditor from './ModalEditor'; // Assuming you have a ModalEditor component

export default function ConfigTable({ chain }) {
  const [localChain, setLocalChain] = useState(chain);
  const [modalData, setModalData] = useState(null); // { fileIndex, key, value } | null

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
    const originalValue = chain[fileIndex]?.data?.[key];
    const isModified = value !== originalValue;
    const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value ?? '';

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={stringValue}
          onChange={e => handleChange(fileIndex, key, e.target.value)}
          style={{
            width: '100%',
            border: isModified ? '1px solid #d8785b' : undefined,
          }}
        />
        <button
          type="button"
          onClick={() => setModalData({ fileIndex, key, value: stringValue })}
          className='view-button'
        >
          <Eye12Regular></Eye12Regular>
        </button>
      </div>
    );
  };

  const renderTextarea = (value, fileIndex, key) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value ?? '';
    const rowCount = stringValue.split('\n').length;
    const maxRows = 5; // Maximum number of rows to display before scrolling
    const rows = Math.min(rowCount, maxRows);
    return (
      <textarea
        value={stringValue}
        onChange={e => handleChange(fileIndex, key, e.target.value)}
        style={{ width: '98%' }}
        rows={rows}
      />
    );
  }

  return (
    <>
    <table style={{ borderCollapse: 'collapse', width: '100%' }} className="config-table">
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
    
    {modalData && (
        <ModalEditor
          initialValue={modalData.value}
          onCancel={() => setModalData(null)}
          onSave={(newVal) => {
            handleChange(modalData.fileIndex, modalData.key, newVal);
            setModalData(null);
          }}
        />
      )}
  </>
  );
}

