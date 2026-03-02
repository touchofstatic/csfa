import { useState, useRef } from 'react';

export default function Header({ exportData, importData }) {
  // temporary? I don't like that importData process and dialog are scattered like that
  const [imported, setImported] = useState(false);

  // to hide the default file input
  const fileInput = useRef(null);

  return (
    <header className="pageheader">
      <dialog
        id="import-dialog"
        popover="true"
      >
        <div
          box-="round"
          id="dialog-content"
        >
          {imported === false ? (
            <p>Are you sure you want to import?</p>
          ) : (
            <p>Data imported.</p>
          )}
          <p style={{ color: 'var(--gb-red)' }}>
            Current data will be overwritten.
          </p>
          <div id="dialog-buttons">
            <button
              commandfor="import-dialog"
              command="close"
              onClick={() => setImported(false)}
            >
              Exit
            </button>
            <input
              type="file"
              accept=".json,application/json"
              ref={fileInput}
              onChange={(event) => {
                importData(event);
                setImported(true);
              }}
              style={{ display: 'none' }}
            ></input>
            <button
              value="import"
              onClick={() => fileInput.current.click()}
            >
              Import
            </button>
          </div>
        </div>
      </dialog>
      <button
        size-="small"
        value="export"
        onClick={exportData}
      >
        Export
      </button>
      <button
        size-="small"
        command="show-modal"
        commandfor="import-dialog"
      >
        Import
      </button>
    </header>
  );
}
