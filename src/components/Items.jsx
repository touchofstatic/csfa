import { useState, useEffect, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const TestContext = createContext();

export default function Items() {
  // load localstorage
  const [items, setItems] = useState(() => {
    const loadItemsDb = JSON.parse(localStorage.getItem("itemsdb"));
    return loadItemsDb || [];
  });
  const [lists, setLists] = useState(() => {
    const loadListsDb = JSON.parse(localStorage.getItem("listsdb"));
    return loadListsDb || [];
  });

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
      })
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
      })
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
      })
    );
  }

  function handleRenameItem(itemId, newItemName) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          return { ...item, name: newItemName };
        }
      })
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
      })
    );
  }

  return (
    <section>
      <form
        onSubmit={handleAddList}
        autoComplete="off"
      >
        <button size-="small">add list</button>
        <input
          type="text"
          name="newList"
          required
        ></input>
      </form>

      {/* FOR DEVELOPMENT */}

      <Roulette items={items} />

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
      <div>--------</div>
      <TestContext.Provider
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
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <List list={list} />
            </li>
          ))}
        </ul>
      </TestContext.Provider>
    </section>
  );
}

function List({ list }) {
  const [draftRenameList, setDraftRenameList] = useState("");
  const [draftAddItem, setDraftAddItem] = useState(false);

  const { items, handleAddItem, handleDeleteList, handleRenameList } =
    useContext(TestContext);
  const myItems = items.filter((item) => list.itemIds.includes(item.id));

  // not renaming list
  if (!draftRenameList) {
    // not adding item
    if (!draftAddItem) {
      return (
        <>
          list {list.name}
          <button
            size-="small"
            onClick={() => {
              setDraftAddItem(true);
            }}
          >
            add item
          </button>
          <button
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
          >
            delete list
          </button>
          <button
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            rename list
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
        </>
      );
    }
    // adding item
    else {
      return (
        <>
          list {list.name}
          <form
            onSubmit={(event) => {
              handleAddItem(event);
              setDraftAddItem(false);
            }}
            autoComplete="off"
          >
            <button size-="small">add item</button>
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
        </>
      );
    }
    // renaming list
  } else {
    return (
      <>
        <input
          value={draftRenameList}
          onChange={(e) => {
            setDraftRenameList(e.target.value);
          }}
          required
        />
        <button
          size-="small"
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameList(list.id, Math.floor(Math.random() * 50));
            // handleRenameList(list.id, draftRenameList);
            setDraftRenameList("");
          }}
        >
          save list
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
      </>
    );
  }
}

function Item({ item, myListId }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(TestContext);
  let progClassName = "prog-" + item.progress;

  // not renaming item
  if (!draftRenameItem) {
    return (
      <>
        <span className={progClassName}>
          item {item.name} prog {item.progress}
        </span>
        <button
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          delete item
        </button>
        <button
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          rename item
        </button>
        <button
          size-="small"
          onClick={() => handleAdvanceItem(item.id)}
        >
          &gt;
        </button>
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
          size-="small"
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameItem(item.id, Math.floor(Math.random() * 50));
            // handleRenameItem(item.id, draftRenameItem);
            setDraftRenameItem("");
          }}
        >
          save item
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
      <button onClick={randomize}>roulette</button>
      <span>{pull.name}</span>
    </>
  );
}
