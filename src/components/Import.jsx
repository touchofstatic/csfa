import { useState, useRef, useContext } from 'react';
import { ManagerContext } from './Contexts';
import idk from '../styles/idk.module.css';

export default function Import() {
  const { importData } = useContext(ManagerContext);

  const [imported, setImported] = useState(false);
  // to hide the default file input
  const fileInput = useRef(null);

  return (
    <>
      <button
        size-="small"
        command="show-modal"
        commandfor="import-dialog"
        className={`active:bg-[var(--color1)]`}
      >
        Import
      </button>

      <dialog
        id="import-dialog"
        popover="true"
        className={`h-4/5 md:h-[30ch] w-full`}
      >
        <article
          className={`flex flex-col align-center justify-center h-full text-center ${idk.idk}`}
          box-="double"
        >
          {/* message */}
          {imported === false ? (
            <p>Are you sure you want to import?</p>
          ) : (
            <p>Data imported.</p>
          )}
          <p style={{ color: 'var(--color1)' }}>
            Current data will be overwritten.
          </p>
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
          <div className="flex gap-[1ch] justify-center">
            <button
              value="import"
              onClick={() => fileInput.current.click()}
            >
              Import
            </button>
            <button
              commandfor="import-dialog"
              command="close"
              onClick={() => setImported(false)}
            >
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
