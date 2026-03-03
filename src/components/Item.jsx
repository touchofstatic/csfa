import { useState, useContext } from 'react';
import { ManagerContext } from './ManagerContext';
import styles from '../styles/Item.module.css';

export default function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState('');
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  let progClassName = 'prog' + item.progress;
  let progDisplay = '';
  switch (progClassName) {
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

  // not renaming item
  if (!draftRenameItem) {
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
          <button size-="small">[x]</button>
          <button
            size-="small"
            // TODO: fix css modules
            className={`${styles.progDisplay} progDisplay`}
            onClick={() => handleAdvanceItem(item.id)}
          >
            {progDisplay} [&gt;]
          </button>
        </div>
        {/* TODO: redundant. fix css modules */}
        <div className={`${styles.itemName} itemName`}>{item.name}</div>
      </div>
    );
  }
  // renaming item
  else {
    return (
      <div className={`${progClassName} item`}>
        <div className="itemControls controls">
          <button
            size-="small"
            disabled
          >
            [-]
          </button>
          <button
            size-="small"
            disabled
          >
            [rn]
          </button>
          <button
            size-="small"
            disabled
          >
            [&gt;]
          </button>
          <span className="progDisplay">{progDisplay}</span>
        </div>

        <form
          onSubmit={(event) => {
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
            defaultValue={draftRenameItem}
            autoFocus
            required
          />
          <span className="controls">
            <button
              size-="small"
              type="submit"
            >
              [rn]
            </button>
            <button
              size-="small"
              onClick={(event) => {
                event.preventDefault();
                setDraftRenameItem('');
              }}
            >
              [c]
            </button>
          </span>
        </form>
      </div>
    );
  }
}
