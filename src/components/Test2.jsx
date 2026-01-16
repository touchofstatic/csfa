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

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("groupsdb", JSON.stringify(groups));
  }, [groups]);

  function handleAddGroup(event) {
    event.preventDefault();
    // FOR DEVELOPMENT
    // const formData = new FormData(event.currentTarget);
    // const newGroup = formData.get("newGroup");
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

  function handleAddItem(event) {
    event.preventDefault();
    const newItemId = uuidv4();
    const formData = new FormData(event.currentTarget);
    const newItem = formData.get("newItem");
    const originGroupId = formData.get("originGroupId");
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
            item {item.name} id {item.id.substring(0, 8)} prog {item.progress}
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
          handleAdvanceItem,
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
  const [draftRenameGroup, setDraftRenameGroup] = useState("");
  const [draftAddItem, setDraftAddItem] = useState(false);

  const { items, handleAddItem, handleDeleteGroup, handleRenameGroup } =
    useContext(TestContext);
  const myItems = items.filter((item) => group.itemIds.includes(item.id));

  // not renaming group
  if (!draftRenameGroup) {
    // not adding item
    if (!draftAddItem) {
      return (
        <>
          group {group.name}
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
            onClick={() => handleDeleteGroup(group.id, myItems)}
          >
            delete group
          </button>
          <button
            size-="small"
            onClick={() => setDraftRenameGroup(group.name)}
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
    // adding item
    else {
      return (
        <>
          group {group.name}
          <form
            onSubmit={(event) => {
              handleAddItem(event);
              console.log("added item");
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
              name="originGroupId"
              value={group.id}
            />
          </form>
        </>
      );
    }
    // renaming group
  } else {
    return (
      <>
        <input
          value={draftRenameGroup}
          onChange={(e) => {
            setDraftRenameGroup(e.target.value);
          }}
          required
        />
        <button
          size-="small"
          onClick={() => {
            // FOR DEVELOPMENT
            handleRenameGroup(group.id, Math.floor(Math.random() * 50));
            // handleRenameGroup(group.id, draftRenameGroup);
            setDraftRenameGroup("");
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
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(TestContext);
  // not renaming item
  if (!draftRenameItem) {
    return (
      <>
        item {item.name} prog {item.progress}
        <button
          size-="small"
          onClick={() => handleDeleteItem(item.id, myGroupId)}
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
