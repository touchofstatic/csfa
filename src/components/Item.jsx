import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './ManagerContext';
import styles from '../styles/item.module.css';

export default function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState('');
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  const ref = useClickAway(() => {
    setDraftRenameItem('');
  });

  let progressClassName = 'progress' + item.progress;
  let progress = '';
  switch (progressClassName) {
    case 'progress0':
      progress = <span className="invisible">undefined</span>;
      break;
    case 'progress1':
      progress = 'queued';
      break;
    case 'progress2':
      progress = 'priority';
      break;
    case 'progress3':
      progress = 'working';
      break;
    case 'progress4':
      progress = 'submitted';
      break;
    case 'progress5':
      progress = 'approved';
      break;
    case 'progress6':
      progress = 'done';
      break;
    default:
      progress = '???';
      break;
  }

  // TODO: bad?
  let title = '';
  if (!draftRenameItem) {
    title = (
      <div className={`${styles.name} ${styles[progressClassName]}`}>
        {item.name}
      </div>
    );
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
    <div className={`${progressClassName}`}>
      <div>
        <button
          className={`${styles.controls} ${styles[progressClassName]}`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [-]
        </button>
        <button
          className={`${styles.controls} ${styles[progressClassName]}`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        <button
          size-="small"
          className={`${styles[progressClassName]} float-right bg-[var(--background0)] text-[var(--foreground2)]`}
          onClick={() => handleAdvanceItem(item.id)}
        >
          {progress} [&gt;]
        </button>
      </div>
      {title}
    </div>
  );
}
