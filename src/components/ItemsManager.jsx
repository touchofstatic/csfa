import { useState, useEffect, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const ItemsManagerContext = createContext();

export default function ItemsManager() {
  // COMMENTED OUT FOR DEVELOPMENT
  // load localstorage
  // const [items, setItems] = useState(() => {
  //   const loadItemsDb = JSON.parse(localStorage.getItem("itemsdb"));
  //   return loadItemsDb || [];
  // });
  // const [lists, setLists] = useState(() => {
  //   const loadListsDb = JSON.parse(localStorage.getItem("listsdb"));
  //   return loadListsDb || [];
  // });

  // FOR DEVELOPMENT
  const [items, setItems] = useState([
    { name: uuidv4().substring(0, 8), progress: 1, id: "1" },
    {
      name: "test test test test test test test test test test test test test test test test test test test test test test",
      progress: 4,
      id: "2",
    },
    { name: uuidv4().substring(0, 8), progress: 5, id: "3" },
    {
      name: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
      progress: 5,
      id: "4",
    },
    { name: uuidv4().substring(0, 8), progress: 2, id: "6" },
    { name: uuidv4().substring(0, 8), progress: 4, id: "7" },
    { name: uuidv4().substring(0, 8), progress: 6, id: "8" },
    { name: uuidv4().substring(0, 8), progress: 6, id: "9" },
  ]);
  const [lists, setLists] = useState([
    {
      name: "something or other",
      id: uuidv4(),
      itemIds: ["1", "2", "4", "9"],
    },
    { name: "2", id: uuidv4(), itemIds: ["3", "8"] },
    {
      name: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
      id: uuidv4(),
      itemIds: [],
    },
    { name: "4", id: uuidv4(), itemIds: [] },
    {
      name: "something or other or other or other or other or other or other",
      id: uuidv4(),
      itemIds: ["6", "7"],
    },
  ]);

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("listsdb", JSON.stringify(lists));
  }, [lists]);

  function handleAddList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newList = formData.get("newList");
    setLists([
      ...lists,
      {
        name: newList,
        id: uuidv4(),
        itemIds: [],
      },
    ]);
  }

  function handleAddItem(event) {
    event.preventDefault();
    const newItemId = uuidv4();
    const formData = new FormData(event.currentTarget);
    const newItem = formData.get("newItem");
    const originListId = formData.get("originListId");
    // create new item
    setItems([
      ...items,
      {
        name: newItem,
        progress: 0,
        id: newItemId,
      },
    ]);
    // update origin list itemIds with the new item's id
    setLists(
      lists.map((list) => {
        if (list.id !== originListId) return list;
        else {
          return { ...list, itemIds: [...list.itemIds, newItemId] };
        }
      }),
    );
  }

  function handleDeleteList(listId, myItems) {
    // kill list's items
    setItems(items.filter((item) => myItems.includes(item) === false));
    // delete list
    setLists(lists.filter((list) => list.id !== listId));
  }

  function handleRenameList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newListName = formData.get("newListName");
    const listId = formData.get("listId");
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else {
          return { ...list, name: newListName };
        }
      }),
    );
  }

  function handleDeleteItem(itemId, myListId) {
    // delete item
    setItems(items.filter((item) => item.id !== itemId));
    // delete id from origin list's itemIds
    setLists(
      lists.map((list) => {
        if (list.id !== myListId) return list;
        else {
          return {
            ...list,
            itemIds: list.itemIds.filter((i) => i !== itemId),
          };
        }
      }),
    );
  }

  function handleRenameItem(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItemName = formData.get("newItemName");
    const itemId = formData.get("itemId");
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          return { ...item, name: newItemName };
        }
      }),
    );
  }

  function handleAdvanceItem(itemId) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          if (item.progress == 6) return { ...item, progress: 0 };
          else return { ...item, progress: item.progress + 1 };
        }
      }),
    );
  }

  return (
    <div className="itemsManager">
      <Roulette items={items} />

      <form
        onSubmit={handleAddList}
        autoComplete="off"
      >
        <input
          type="text"
          name="newList"
          required
        ></input>
        <button type="submit">[+]</button>
      </form>

      {/* LIST-ITEM DB VIEWER */}
      {/* <div>--------</div>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            list {list.name} itemIds {list.itemIds.toString()}
          </li>
        ))}
      </ul>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            item {item.name} id {item.id.substring(0, 8)} prog {item.progress}
          </li>
        ))}
      </ul>
      <div>--------</div> */}

      <ItemsManagerContext.Provider
        value={{
          items,
          handleAddItem,
          handleDeleteList,
          handleRenameList,
          handleDeleteItem,
          handleRenameItem,
          handleAdvanceItem,
        }}
      >
        <ul className="lists grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))] gap-[2ch]">
          {lists.map((list) => (
            <li key={list.id}>
              <List list={list} />
            </li>
          ))}
        </ul>
      </ItemsManagerContext.Provider>
    </div>
  );
}

function List({ list }) {
  const [draftRenameList, setDraftRenameList] = useState("");
  const [draftAddItem, setDraftAddItem] = useState(false);

  const { items, handleAddItem, handleDeleteList, handleRenameList } =
    useContext(ItemsManagerContext);
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
            </div>
            <div className="listName">{list.name}</div>
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
              setDraftRenameList("");
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
                  setDraftRenameList("");
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

function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ItemsManagerContext);

  let progClassName = "prog-" + item.progress;
  let progDisplay = "";
  switch (progClassName) {
    case "prog-0":
      progDisplay = "";
      break;
    case "prog-1":
      progDisplay = "queued";
      break;
    case "prog-2":
      progDisplay = "priority";
      break;
    case "prog-3":
      progDisplay = "working";
      break;
    case "prog-4":
      progDisplay = "submitted";
      break;
    case "prog-5":
      progDisplay = "approved";
      break;
    case "prog-6":
      progDisplay = "done";
      break;
    default:
      progDisplay = "UNDEFINED";
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
            setDraftRenameItem("");
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
                setDraftRenameItem("");
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

// to be component?
function Roulette({ items }) {
  const [pull, setPull] = useState("");

  function randomize() {
    if (items.length > 0) {
      let randomIndex = Math.floor(Math.random() * items.length);
      setPull(items[randomIndex]);
    }
  }

  return (
    <div className="roulette">
      <button onClick={randomize}>[roulette]</button>
      <div className="roulettePull">{pull.name}</div>
    </div>
  );
}
