import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './Contexts';
import styles from '../styles/item.module.css';

export default function Item({ item, myListId, range }) {
  const [draftRenameItem, setDraftRenameItem] =
    useState('');
  const {
    handleDeleteItem,
    handleRenameItem,
    handleAdvanceItem,
  } = useContext(ManagerContext);

  const ref = useClickAway(() => {
    setDraftRenameItem('');
  });

  let progressClassName = 'progress' + item.progress;
  let progress = '';

  switch (progressClassName) {
    case 'progress0':
      progress = (
        <span className="invisible">{range[0]}</span>
      );
      // progress = <span className="invisible">unspecified</span>;
      break;
    case 'progress1':
      progress = range[1];
      break;
    case 'progress2':
      progress = range[2];
      break;
    case 'progress3':
      progress = range[3];
      break;
    case 'progress4':
      progress = range[4];
      break;
    case 'progress5':
      progress = range[5];
      break;
    case 'progress6':
      progress = range[6];
      break;
    default:
      progress = '???';
      break;
  }

  // TODO: bad?
  let title = '';
  if (!draftRenameItem) {
    title = (
      <div
        className={`${styles.name} ${styles[progressClassName]} noselect pl-[1ch]`}
      >
        {item.name}
      </div>
    );
  } else {
    title = (
      <form
        ref={ref}
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
            [Cancel]
          </button>
          <button
            className="w-full"
            size-="small"
            type="submit"
          >
            [Save]
          </button>
        </span>
      </form>
    );
  }

  return (
    <div className={`${progressClassName} ${styles.item}`}>
      <div>
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0`}
          size-="small"
          onClick={() =>
            handleDeleteItem(item.id, myListId)
          }
        >
          [-]
        </button>
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        <button
          size-="small"
          className={`${styles[progressClassName]} float-right bg-transparent text-[var(--foreground2)] p-0`}
          onClick={() => handleAdvanceItem(item.id)}
        >
          {progress} [&gt;]
        </button>
      </div>
      {title}
    </div>
  );
}
