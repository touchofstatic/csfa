import { useState, useEffect, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const TestContext = createContext();

export default function Items() {
  // load localstorage
  const [items, setItems] = useState(() => {
    const loadItemsDb = JSON.parse(localStorage.getItem("itemsdb"));
    return loadItemsDb || [];
  });
  const [groups, setGroups] = useState(() => {
    const loadGroupsDb = JSON.parse(localStorage.getItem("groupsdb"));
    return loadGroupsDb || [];
  });

  // FOR DEVELOPMENT
  // const [items, setItems] = useState([
  //   { name: 1, id: 1 },
  //   { name: 2, id: 2 },
  //   { name: 3, id: 3 },
  // ]);
  // const [groups, setGroups] = useState([
  //   { name: 1, id: uuidv4(), itemIds: [1, 2] },
  //   { name: 2, id: uuidv4(), itemIds: [3] },
  // ]);

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("groupsdb", JSON.stringify(groups));
  }, [groups]);

  function handleAddGroup(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newGroup = formData.get("newGroup");
    setGroups([
      ...groups,
      {
        // name: newGroup,
        // FOR DEVELOPMENT
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

  function handleRenameGroup(groupId, newGroupName) {
    setGroups(
      groups.map((group) => {
        if (group.id !== groupId) return group;
        else {
          return { ...group, name: newGroupName };
        }
      })
    );
  }

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

  return (
    <section>
      <form
        onSubmit={handleAddGroup}
        autoComplete="off"
      >
        <button size-="small">add group</button>
        <input
          type="text"
          name="newGroup"
          required
        ></input>
      </form>

      {/* FOR DEVELOPMENT */}
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
            item {item.name} id {item.id.substring(0, 8)}
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
          handleRenameItem,
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
  const [draftGroupRename, setDraftGroupRename] = useState("");

  const { items, handleAddItem, handleDeleteGroup, handleRenameGroup } =
    useContext(TestContext);
  const myItems = items.filter((item) => group.itemIds.includes(item.id));

  // not editing
  if (!draftGroupRename) {
    return (
      <>
        group {group.name}
        <button
          size-="small"
          onClick={() => handleAddItem(group.id)}
        >
          add item to group
        </button>
        <button
          size-="small"
          onClick={() => handleDeleteGroup(group.id, myItems)}
        >
          delete group
        </button>
        <button
          size-="small"
          onClick={() => setDraftGroupRename(group.name)}
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
    // editing
  } else {
    return (
      <>
        <input
          value={draftGroupRename}
          onChange={(e) => {
            setDraftGroupRename(e.target.value);
          }}
          required
        />
        <button
          size-="small"
          onClick={() => handleAddItem(group.id)}
        >
          add item to group
        </button>
        <button
          size-="small"
          onClick={() => handleDeleteGroup(group.id, myItems)}
        >
          delete group
        </button>
        <button
          size-="small"
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameGroup(group.id, Math.floor(Math.random() * 50));
            // handleRenameGroup(group.id, draftGroupRename);
            setDraftGroupRename("");
          }}
        >
          save group
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
}

function Item({ item, myGroupId }) {
  const [draftItemRename, setDraftItemRename] = useState("");
  const { handleDeleteItem, handleRenameItem } = useContext(TestContext);
  // not editing
  if (!draftItemRename) {
    return (
      <>
        item {item.name}
        <button
          size-="small"
          onClick={() => handleDeleteItem(item.id, myGroupId)}
        >
          delete item
        </button>
        <button
          size-="small"
          onClick={() => setDraftItemRename(item.name)}
        >
          rename item
        </button>
      </>
    );
  }
  // editing
  else {
    return (
      <>
        <input
          value={draftItemRename}
          onChange={(e) => {
            setDraftItemRename(e.target.value);
          }}
          required
        />
        <button
          size-="small"
          onClick={() => handleDeleteItem(item.id, myGroupId)}
        >
          delete item
        </button>
        <button
          size-="small"
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameItem(item.id, Math.floor(Math.random() * 50));
            // handleRenameItem(item.id, draftItemRename);
            setDraftItemRename("");
          }}
        >
          save item
        </button>
      </>
    );
  }
}
