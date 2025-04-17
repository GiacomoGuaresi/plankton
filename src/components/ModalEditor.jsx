import React, { useState } from 'react';
import './ModalEditor.css';

export default function ModalEditor({ initialValue, onSave, onCancel }) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={10}
        />
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={() => onCancel()}>Cancel</button>
          <button onClick={() => onSave(value)}>Set</button>
        </div>
      </div>
    </div>
  );
}
