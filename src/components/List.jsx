import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './ManagerContext';
import styles from '../styles/list.module.css';
import Item from './Item';

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
    handleRenameRange,
  } = useContext(ManagerContext);
  const myItems = items.filter((item) => list.itemIds.includes(item.id));

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
            type="button"
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
    <div
      className={`${styles.list} ${!list.visible ? `${styles.collapsed}` : ''}`}
    >
      <header className={`${!list.visible ? `${styles.collapsed}` : ''}`}>
        <div>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''}`}
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
          >
            [-]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''}`}
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            [rn]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''}`}
            size-="small"
            command="show-modal"
            commandfor={`settings-dialog-${list.id}`}
          >
            [s]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''}`}
            size-="small"
            onClick={() => handleCollapseList(list.id)}
          >
            {list.visible ? `[▼]` : `[▲]`}
          </button>

          <span> | {myItems.length} items</span>
        </div>
        {title}
      </header>
      <hr
        className={`${styles.separator} ${!list.visible ? `${styles.collapsed}` : ''}`}
      ></hr>

      {list.visible && (
        <ul>
          {myItems.map((item) => (
            <li key={item.id}>
              <Item
                item={item}
                myListId={list.id}
                range={list.range}
              />
            </li>
          ))}
        </ul>
      )}
      <form
        className={`${styles.add} flex gap-[1ch]`}
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
          className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''}`}
        >
          [+]
        </button>
      </form>

      <dialog
        className={styles.dialog}
        id={`settings-dialog-${list.id}`}
        popover="true"
      >
        <div
          box-="double"
          shear-="top"
        >
          <div
            is-="badge"
            className={`${styles.badge} overflow-hidden whitespace-nowrap text-ellipsis max-w-[20ch] md:max-w-[40ch]`}
          >
            {list.name}
          </div>
          <div className={styles.dialogContent}>
            <form
              className={styles.settingsRangeForm}
              onSubmit={(event) => {
                handleRenameRange(event);
              }}
              autoComplete="off"
            >
              <input
                type="hidden"
                name="listId"
                value={list.id}
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[1]}
                className={`${styles.progress1}`}
                required
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[2]}
                className={styles.progress2}
                required
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[3]}
                className={styles.progress3}
                required
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[4]}
                className={styles.progress4}
                required
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[5]}
                className={styles.progress5}
                required
              />
              <input
                type="text"
                name="progress"
                defaultValue={list.range[6]}
                className={styles.progress6}
                required
              />
              <button
                type="submit"
                size-="small"
                className="self-end"
              >
                [Update]
              </button>
            </form>
            <div className={styles.dialogButtons}>
              <button
                commandfor={`settings-dialog-${list.id}`}
                command="close"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
