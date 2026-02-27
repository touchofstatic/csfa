import { useState, useContext } from 'react';
import { ItemsManagerContext } from './ItemsManagerContext';

export default function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState('');
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ItemsManagerContext);

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
          <button onClick={() => handleDeleteItem(item.id, myListId)}>
            [-]
          </button>
          <button onClick={() => setDraftRenameItem(item.name)}>[rn]</button>
          <button onClick={() => handleAdvanceItem(item.id)}>[&gt;]</button>
          <span className="progDisplay">{progDisplay}</span>
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
          <button disabled>[-]</button>
          <button disabled>[rn]</button>
          <button disabled>[&gt;]</button>
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
            <button type="submit">[rn]</button>
            <button
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
