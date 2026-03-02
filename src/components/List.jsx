import { useState, useContext } from 'react';
import { ManagerContext } from './ManagerContext';
import Item from './Item';

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

  // not renaming list
  if (!draftRenameList) {
    // not adding item
    if (!draftAddItem) {
      return (
        <div className="list">
          <header>
            <div className="listControls">
              <button
                onClick={() => {
                  setDraftAddItem(true);
                }}
              >
                [+]
              </button>
              <button onClick={() => handleDeleteList(list.id, myItems)}>
                [-]
              </button>
              <button onClick={() => setDraftRenameList(list.name)}>
                [rn]
              </button>
              <button onClick={() => handleCollapseList(list.id)}>
                {list.visible ? `[▼]` : `[▲]`}
              </button>
            </div>
            <div className="listName">{list.name}</div>
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
        </div>
      );
    }
    // adding item
    else {
      return (
        <div className="list">
          <header>
            <div className="listControls">
              <button disabled>[+]</button>
              <button disabled>[-]</button>
              <button disabled>[rn]</button>
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
              <span>
                <button type="submit">[+]</button>
                <button
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
          <div className="listControls">
            <button disabled>[+]</button>
            <button disabled>[-]</button>
            <button disabled>[rn]</button>
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
            <span>
              <button type="submit">[rn]</button>
              <button
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
