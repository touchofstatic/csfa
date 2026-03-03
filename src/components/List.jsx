import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './ManagerContext';
import Item from './Item';
import styles from '../styles/List.module.css';

export default function List({ list }) {
  const [draftRenameList, setDraftRenameList] = useState('');
  const ref = useClickAway(() => {
    setDraftRenameList('');
  });

  const {
    items,
    handleAddItem,
    handleDeleteList,
    handleRenameList,
    handleCollapseList,
  } = useContext(ManagerContext);
  const myItems = items.filter((item) => list.itemIds.includes(item.id));

  // TODO: bad?
  const visibleStyle = {
    color: list.visible ? 'var(--foreground0)' : 'var(--background3)',
  };

  // TODO: bad?
  let title = '';
  if (!draftRenameList) {
    title = <div className={styles.name}>{list.name}</div>;
  } else {
    title = (
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          handleRenameList(event);
          setDraftRenameList('');
        }}
        autoComplete="off"
      >
        <input
          type="hidden"
          name="listId"
          value={list.id}
        ></input>
        <input
          type="text"
          name="newListName"
          className="w-full"
          defaultValue={draftRenameList}
          autoFocus
          required
        />
        <span className="flex gap-[1ch]">
          <button
            className="w-full"
            size-="small"
            onClick={(event) => {
              event.preventDefault();
              setDraftRenameList('');
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
    <div className={styles.list}>
      <header style={visibleStyle}>
        <div className="listControls controls">
          <button
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
            style={visibleStyle}
          >
            [-]
          </button>
          <button
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
            style={visibleStyle}
          >
            [rn]
          </button>
          <button
            size-="small"
            onClick={() => handleCollapseList(list.id)}
            style={visibleStyle}
          >
            {list.visible ? `[▼]` : `[▲]`}
          </button>
          <span> | {myItems.length} items</span>
        </div>
        {title}
      </header>
      <hr className="separator"></hr>

      {list.visible && (
        <ul>
          {myItems.map((item) => (
            <li key={item.id}>
              <Item
                item={item}
                myListId={list.id}
              />
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex gap-[1ch]"
        onSubmit={(event) => {
          event.preventDefault();
          handleAddItem(event);
        }}
        autoComplete="off"
      >
        <input
          type="hidden"
          name="originListId"
          value={list.id}
        />
        <input
          className="w-full"
          type="text"
          name="newItem"
          required
        />
        <button
          size-="small"
          type="submit"
        >
          [+]
        </button>
      </form>
    </div>
  );
}
