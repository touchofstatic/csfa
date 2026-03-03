import { useState, useContext } from 'react';
import { ManagerContext } from './ManagerContext';
import Item from './Item';
import styles from '../styles/List.module.css';

export default function List({ list }) {
  const [draftRenameList, setDraftRenameList] = useState('');
  const [draftAddItem, setDraftAddItem] = useState(false);

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

  // not renaming list
  if (!draftRenameList) {
    // not adding item
    if (!draftAddItem) {
      return (
        <div className={styles.list}>
          <header style={visibleStyle}>
            <div className="listControls controls">
              <button
                className="controls"
                size-="small"
                onClick={() => {
                  setDraftAddItem(true);
                }}
                style={visibleStyle}
              >
                [+]
              </button>
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
            <div className={styles.name}>{list.name}</div>
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

          <input
            type="text"
            className="w-full"
          ></input>
        </div>
      );
    }
    // adding item
    else {
      return (
        <div className="list">
          <header>
            <div className="listControls controls">
              <button
                size-="small"
                disabled
              >
                [+]
              </button>
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
            </div>
            <div className="listName">{list.name}</div>

            <form
              onSubmit={(event) => {
                handleAddItem(event);
                setDraftAddItem(false);
              }}
              autoComplete="off"
            >
              <input
                type="hidden"
                name="originListId"
                value={list.id}
              />
              <input
                type="text"
                name="newItem"
                autoFocus
                required
              />
              <span className="controls">
                <button
                  size-="small"
                  type="submit"
                >
                  [+]
                </button>
                <button
                  size-="small"
                  onClick={(event) => {
                    event.preventDefault();
                    setDraftAddItem(false);
                  }}
                >
                  [c]
                </button>
              </span>
            </form>
          </header>
          <hr className="separator"></hr>

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
        </div>
      );
    }
    // renaming list
  } else {
    return (
      <div className="list">
        <header>
          <div className="listControls controls">
            <button
              size-="small"
              disabled
            >
              [+]
            </button>
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
          </div>

          <form
            onSubmit={(event) => {
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
              defaultValue={draftRenameList}
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
                  setDraftRenameList('');
                }}
              >
                [c]
              </button>
            </span>
          </form>
        </header>
        <hr className="separator"></hr>

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
      </div>
    );
  }
}
