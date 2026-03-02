import { useRef } from 'react';

export default function Header({ exportData, importData }) {
  // to hide the default file input
  const fileInput = useRef(null);

  return (
    <header>
      <button
        value="export"
        onClick={exportData}
      >
        Export
      </button>

      <input
        type="file"
        accept=".json,application/json"
        ref={fileInput}
        onChange={importData}
        style={{ display: 'none' }}
      ></input>
      <button
        value="import"
        onClick={() => fileInput.current.click()}
      >
        Import
      </button>
    </header>
  );
}
