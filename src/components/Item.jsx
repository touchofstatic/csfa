import { useState, useContext } from 'react';
import { ManagerContext } from './ManagerContext';

export default function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState('');
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  let progClassName = 'prog-' + item.progress;
  let progDisplay = '';
  switch (progClassName) {
    case 'prog-0':
      progDisplay = '';
      break;
    case 'prog-1':
      progDisplay = 'queued';
      break;
    case 'prog-2':
      progDisplay = 'priority';
      break;
    case 'prog-3':
      progDisplay = 'working';
      break;
    case 'prog-4':
      progDisplay = 'submitted';
      break;
    case 'prog-5':
      progDisplay = 'approved';
      break;
    case 'prog-6':
      progDisplay = 'done';
      break;
    default:
      progDisplay = 'UNDEFINED';
      break;
  }

  // not renaming item
  if (!draftRenameItem) {
    return (
      <div className={`${progClassName} item`}>
        <div className="itemControls">
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
            onClick={() => handleAdvanceItem(item.id)}
          >
            [&gt;]
          </button>
          <span
            size-="small"
            className="progDisplay"
          >
            {progDisplay}
          </span>
        </div>
        <div className="itemName">{item.name}</div>
      </div>
    );
  }
  // renaming item
  else {
    return (
      <div className={`${progClassName} item`}>
        <div className="itemControls">
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
          <span>
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
