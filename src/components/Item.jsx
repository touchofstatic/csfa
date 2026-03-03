import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './ManagerContext';
import styles from '../styles/Item.module.css';

export default function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState('');
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  const ref = useClickAway(() => {
    setDraftRenameItem('');
  });

  let progClassName = 'prog' + item.progress;
  let progDisplay = '';
  switch (progClassName) {
    // TODO: make empty space here more clickable
    case 'prog0':
      progDisplay = '';
      break;
    case 'prog1':
      progDisplay = 'queued';
      break;
    case 'prog2':
      progDisplay = 'priority';
      break;
    case 'prog3':
      progDisplay = 'working';
      break;
    case 'prog4':
      progDisplay = 'submitted';
      break;
    case 'prog5':
      progDisplay = 'approved';
      break;
    case 'prog6':
      progDisplay = 'done';
      break;
    default:
      progDisplay = 'UNDEFINED';
      break;
  }

  // TODO: bad?
  let title = '';
  if (!draftRenameItem) {
    title = <div className={`${styles.itemName} itemName`}>{item.name}</div>;
  } else {
    title = (
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          handleRenameItem(event);
          setDraftRenameItem('');
        }}
        autoComplete="off"
      >
        <input
          type="hidden"
          name="itemId"
          value={item.id}
        />
        <input
          type="text"
          name="newItemName"
          className="w-full"
          defaultValue={draftRenameItem}
          autoFocus
          required
        />
        <span className="flex gap-[1ch]">
          <button
            type="button"
            className="w-full"
            size-="small"
            onClick={(event) => {
              event.preventDefault();
              setDraftRenameItem('');
            }}
          >
            [c]
          </button>
          <button
            className="w-full"
            size-="small"
            type="submit"
          >
            [rn]
          </button>
        </span>
      </form>
    );
  }

  return (
    <div className={`${progClassName} ${styles.item}`}>
      <div className="itemControls controls">
        <button
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [-]
        </button>
        <button
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        <button
          size-="small"
          // TODO: redundant fix css modules
          className={`${styles.progDisplay} progDisplay`}
          onClick={() => handleAdvanceItem(item.id)}
        >
          {progDisplay} [&gt;]
        </button>
      </div>
      {title}
    </div>
  );
}
