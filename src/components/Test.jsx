import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function TestItem({ item, onDeleteItem }) {
  return (
    <>
      item {item.name}{" "}
      <button
        size-="small"
        onClick={() => onDeleteItem(item.id)}
      >
        -
      </button>
    </>
  );
}

function TestList({ list, onDeleteList, onRenameList }) {
  return (
    <>
      list {list.name}{" "}
      <button
        size-="small"
        onClick={() => onDeleteList(list.id)}
      >
        -
      </button>
      <button
        size-="small"
        onClick={() => onRenameList(list.id)}
      >
        e
      </button>
      <ul marker-="bullet">
        {list.items.map((item) => (
          <li key={item.id}>
            <TestItem item={item} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Test() {
  // load localstorage
  const [lists, setLists] = useState(() => {
    const loadDb = JSON.parse(localStorage.getItem("listdb"));
    return loadDb || [];
  });

  useEffect(() => {
    localStorage.setItem("listdb", JSON.stringify(lists));
  }, [lists]);

  function createList(event) {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const newList = formData.get("list");
    setLists([
      ...lists,
      {
        name: Math.floor(Math.random() * 50),
        id: uuidv4(),
        items: [
          { name: 1, id: uuidv4() },
          { name: 2, id: uuidv4() },
        ],
      },
    ]);
  }

  function handleDeleteList(id) {
    setLists(lists.filter((list) => list.id !== id));
  }

  function handleRenameList(id) {
    setLists(
      lists.map((list) => {
        if (id !== list.id) return list;
        else {
          return { ...list, name: Math.floor(Math.random() * 50) };
        }
      })
    );
  }

  return (
    <section>
      <form
        onSubmit={createList}
        autoComplete="off"
        className="create-list"
      >
        <button size-="small">create list</button>
        <input
          type="text"
          name="list"
          // required
        ></input>
      </form>

      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <TestList
              list={list}
              onDeleteList={() => handleDeleteList(list.id)}
              onRenameList={() => handleRenameList(list.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
