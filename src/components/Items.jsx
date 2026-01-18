import { useState, useEffect, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const ItemsContext = createContext();

// RENAME
export default function Area() {
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
    { name: "1", id: uuidv4(), itemIds: ["1", "2", "4", "9"] },
    { name: "2", id: uuidv4(), itemIds: ["3"] },
    { name: "3", id: uuidv4(), itemIds: [] },
    { name: "4", id: uuidv4(), itemIds: [] },
    { name: "5", id: uuidv4(), itemIds: ["6", "7", "8"] },
  ]);

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("listsdb", JSON.stringify(lists));
  }, [lists]);

  function handleAddList(event) {
    event.preventDefault();
    // FOR DEVELOPMENT
    // const formData = new FormData(event.currentTarget);
    // const newList = formData.get("newList");
    setLists([
      ...lists,
      {
        // name: newList,
        // FOR DEVELOPMENT
        name: Math.floor(Math.random() * 50),
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
        // FOR DEVELOPMENT
        // name: Math.floor(Math.random() * 50),
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

  function handleRenameList(listId, newListName) {
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

  function handleRenameItem(itemId, newItemName) {
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
    <>
      <form
        onSubmit={handleAddList}
        autoComplete="off"
      >
        <button>add list</button>
        <input
          type="text"
          name="newList"
          required
        ></input>
      </form>

      <Roulette items={items} />

      {/* FOR DEVELOPMENT */}
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

      <ItemsContext.Provider
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
        <ul className="areaBlock grid grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))] gap-[2ch]">
          {lists.map((list) => (
            <li key={list.id}>
              <List list={list} />
            </li>
          ))}
        </ul>
      </ItemsContext.Provider>
    </>
  );
}

function List({ list }) {
  const [draftRenameList, setDraftRenameList] = useState("");
  const [draftAddItem, setDraftAddItem] = useState(false);

  const { items, handleAddItem, handleDeleteList, handleRenameList } =
    useContext(ItemsContext);
  const myItems = items.filter((item) => list.itemIds.includes(item.id));

  // not renaming list
  if (!draftRenameList) {
    // not adding item
    if (!draftAddItem) {
      return (
        <>
          <header className="listHeader">
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
            <button onClick={() => setDraftRenameList(list.name)}>[rn]</button>
            <span>list {list.name}</span>
          </header>

          <ul className="listBody">
            {myItems.map((item) => (
              <li key={item.id}>
                <Item
                  item={item}
                  myListId={list.id}
                />
              </li>
            ))}
          </ul>
        </>
      );
    }
    // adding item
    else {
      return (
        <div>
          <span>list {list.name}</span>
          <form
            onSubmit={(event) => {
              handleAddItem(event);
              setDraftAddItem(false);
            }}
            autoComplete="off"
          >
            <button>[+]</button>
            <input
              type="text"
              name="newItem"
              required
            />
            <input
              type="hidden"
              name="originListId"
              value={list.id}
            />
          </form>
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
      <div>
        <input
          value={draftRenameList}
          onChange={(e) => {
            setDraftRenameList(e.target.value);
          }}
          required
        />
        <button
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameList(list.id, Math.floor(Math.random() * 50));
            // handleRenameList(list.id, draftRenameList);
            setDraftRenameList("");
          }}
        >
          save
        </button>
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
    useContext(ItemsContext);
  let progClassName = "prog-" + item.progress;

  // not renaming item
  if (!draftRenameItem) {
    return (
      <>
        <div className="itemButtons">
          <button onClick={() => handleDeleteItem(item.id, myListId)}>
            [-]
          </button>
          <button onClick={() => setDraftRenameItem(item.name)}>[rn]</button>
          <button onClick={() => handleAdvanceItem(item.id)}>[&gt;]</button>
        </div>
        <div className={`${progClassName} itemName`}>{item.name}</div>
      </>
    );
  }
  // renaming item
  else {
    return (
      <>
        <input
          value={draftRenameItem}
          onChange={(e) => {
            setDraftRenameItem(e.target.value);
          }}
          required
        />
        <button
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameItem(item.id, Math.floor(Math.random() * 50));
            // handleRenameItem(item.id, draftRenameItem);
            setDraftRenameItem("");
          }}
        >
          [save]
        </button>
      </>
    );
  }
}

function Roulette({ items }) {
  const [pull, setPull] = useState("");

  function randomize() {
    if (items.length > 0) {
      let randomIndex = Math.floor(Math.random() * items.length);
      setPull(items[randomIndex]);
    }
  }

  return (
    <>
      <button onClick={randomize}>[roulette]</button>
      <span>{pull.name}</span>
    </>
  );
}
