import { useState, useEffect, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const TestContext = createContext();

export default function Grandparent() {
  // load localstorage
  // const [items, setItems] = useState(() => {
  //   const loadItemsDb = JSON.parse(localStorage.getItem("itemsdb"));
  //   return loadItemsDb || [];
  // });
  const [items, setItems] = useState([
    { name: 1, id: 1 },
    { name: 2, id: 2 },
    { name: 3, id: 3 },
  ]);
  const [groups, setGroups] = useState([
    { name: 1, id: uuidv4(), itemIds: [1, 2] },
    { name: 2, id: uuidv4(), itemIds: [3] },
  ]);

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("groupsdb", JSON.stringify(groups));
  }, [groups]);

  function handleAddGroup(event) {
    event.preventDefault();
    setGroups([
      ...groups,
      {
        name: Math.floor(Math.random() * 50),
        id: uuidv4(),
        itemIds: [],
      },
    ]);
  }

  function handleAddItem(originGroupId) {
    const newItemId = uuidv4();
    // create new item
    setItems([
      ...items,
      {
        name: Math.floor(Math.random() * 50),
        id: newItemId,
      },
    ]);
    // update origin group itemIds with the new item's id
    setGroups(
      groups.map((group) => {
        if (group.id !== originGroupId) return group;
        else {
          return { ...group, itemIds: [...group.itemIds, newItemId] };
        }
      })
    );
  }

  function handleDeleteGroup(groupId, myItems) {
    // kill group's items
    setItems(items.filter((item) => myItems.includes(item) === false));
    // delete group
    setGroups(groups.filter((group) => group.id !== groupId));
  }

  function handleRenameGroup(groupId) {}

  function handleDeleteItem(itemId, myGroupId) {
    // delete item
    setItems(items.filter((item) => item.id !== itemId));
    // delete id from origin group's itemIds
    setGroups(
      groups.map((group) => {
        if (group.id !== myGroupId) return group;
        else {
          return {
            ...group,
            itemIds: group.itemIds.filter((i) => i !== itemId),
          };
        }
      })
    );
  }

  return (
    <section>
      <form
        onSubmit={handleAddGroup}
        autoComplete="off"
      >
        <button size-="small">add group</button>
        <input
          type="text"
          name="list"
        ></input>
      </form>

      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            group {group.name} itemIds {group.itemIds.toString()}
          </li>
        ))}
      </ul>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            item {item.name} id {item.id}
          </li>
        ))}
      </ul>

      <div>--------</div>

      <TestContext.Provider
        value={{
          items,
          handleAddItem,
          handleDeleteGroup,
          handleRenameGroup,
          handleDeleteItem,
        }}
      >
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <Group group={group} />
            </li>
          ))}
        </ul>
      </TestContext.Provider>
    </section>
  );
}

function Group({ group }) {
  const { items, handleAddItem, handleDeleteGroup, handleRenameGroup } =
    useContext(TestContext);
  const myItems = items.filter((item) => group.itemIds.includes(item.id));
  return (
    <>
      group {group.name}
      <button
        size-="small"
        onClick={() => handleAddItem(group.id)}
      >
        add item from group
      </button>
      <button
        size-="small"
        onClick={() => handleDeleteGroup(group.id, myItems)}
      >
        delete group
      </button>
      <button
        size-="small"
        onClick={() => handleRenameGroup(group.id)}
      >
        rename group
      </button>
      <ul>
        {myItems.map((item) => (
          <li key={item.id}>
            <Item
              item={item}
              myGroupId={group.id}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function Item({ item, myGroupId }) {
  const { handleDeleteItem } = useContext(TestContext);
  return (
    <>
      item {item.name}
      <button
        size-="small"
        onClick={() => handleDeleteItem(item.id, myGroupId)}
      >
        delete item
      </button>
    </>
  );
}
