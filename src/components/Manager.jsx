import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ManagerContext } from "./Contexts";
import Random from "./Random.jsx";
import Navbar from "./Navbar";
import Ascii from "./Ascii";
import Board from "./Board.jsx";
import Pomo from "./Pomo.jsx";

// FOR DEVELOPMENT
import { itemsdb, listsdb, userProgsdb, SYSTEM_DEFAULT_PROGS } from "./data";
// TODO: ported from pomo. merge
import { userconfig, DEFAULTCONFIG } from "./configdb.jsx";

// TODO: should I put this somewhere else idk
// DnD logic
const reorder = (source, startIndex, endIndex) => {
  const result = structuredClone(source);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = structuredClone(source);
  const destClone = structuredClone(destination);
  const [removed] = sourceClone.itemIds.splice(droppableSource.index, 1);
  destClone.itemIds.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default function Manager() {
  // const [items, setItems] = useState(() => {
  //   const loadItemsDb = JSON.parse(localStorage.getItem('itemsdb'));
  //   return loadItemsDb || [];
  // });
  // const [lists, setLists] = useState(() => {
  //   const loadListsDb = JSON.parse(localStorage.getItem('listsdb'));
  //   return loadListsDb || [];
  // });

  // FOR DEVELOPMENT
  const [lists, setLists] = useState(listsdb);
  const [items, setItems] = useState(itemsdb);
  const [userProgs, setUserProgs] = useState(userProgsdb);
  // TODO: ported from pomo. merge
  const [config, setConfig] = useState(userconfig);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("userProgs", JSON.stringify(userProgs));
  }, [userProgs]);

  // TODO: ported from pomo. merge user settings
  useEffect(() => {
    localStorage.setItem("userconfig", JSON.stringify(config));
  }, [config]);

  // TODO: ported from pomo. merge
  function changeConfig(value, name) {
    if (name === "pomo" || name === "short" || name === "long")
      setConfig({ ...config, [name]: Number(value) * 60 });
    if (name === "volume") setConfig({ ...config, volume: value });
    if (name === "interval") setConfig({ ...config, interval: value });
    if (name === "auto") {
      if (value === "yes") setConfig({ ...config, autoStart: true });
      if (value === "no") setConfig({ ...config, autoStart: false });
    }
  }

  function resetConfig() {
    setConfig({
      pomo: DEFAULTCONFIG.pomo,
      short: DEFAULTCONFIG.short,
      long: DEFAULTCONFIG.long,
      interval: DEFAULTCONFIG.interval,
      autoStart: DEFAULTCONFIG.autoStart,
      volume: DEFAULTCONFIG.volume,
    });
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const result = reorder(
        lists[sInd].itemIds,
        source.index,
        destination.index,
      );
      setLists(
        lists.map((list, index) => {
          if (index !== sInd) return list;
          else return { ...list, itemIds: result };
        }),
      );
    } else {
      const result = move(lists[sInd], lists[dInd], source, destination);
      const newLists = [...lists];
      newLists[sInd] = result[sInd];
      newLists[dInd] = result[dInd];
      setLists(newLists);
    }
  }

  function handleAddList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let newList = formData.get("newList");
    if (newList === "") newList = "Untitled";
    event.target.reset();
    setLists([
      ...lists,
      {
        name: newList,
        id: uuidv4(),
        itemIds: [],
        visible: true,
        progs: userProgs,
      },
    ]);
  }

  function handleAddItem(event) {
    event.preventDefault();
    const newItemId = uuidv4();
    const formData = new FormData(event.currentTarget);
    const newItem = formData.get("newItem");
    const originListId = formData.get("originListId");
    event.target.reset();
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
          return {
            ...list,
            itemIds: [...list.itemIds, newItemId],
          };
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
    let newListName = formData.get("newListName");
    if (newListName === "") newListName = "Untitled";

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

  function handleCollapseList(listId) {
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else {
          return { ...list, visible: !list.visible };
        }
      }),
    );
  }

  function handleGroupList(listId, myItems) {
    // put item in its numbered progress box
    let newOrder = [[], [], [], [], [], [], []];
    myItems.map((item) => {
      newOrder[item.progress].push(item.id);
    });
    // untyped items go to bottom
    newOrder.push(newOrder.shift());
    // empty boxes will be removed
    newOrder = newOrder.flat();
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else return { ...list, itemIds: newOrder };
      }),
    );
  }

  function handleMoveList(index, direction) {
    const newOrder = structuredClone(lists);
    if (direction === "up" && index > 0) {
      const [target] = newOrder.splice(index, 1);
      newOrder.splice(index - 1, 0, target);
    }
    if (direction === "down" && index < lists.length) {
      const [target] = newOrder.splice(index, 1);
      newOrder.splice(index + 1, 0, target);
    }
    setLists(newOrder);
  }

  function handleRenameListProgs(value, index, listId) {
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else {
          let newProgs = structuredClone(list.progs);
          newProgs[index] = value;
          return { ...list, progs: newProgs };
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

  function handleImportBoard(lists, items) {
    setLists(lists);
    setItems(items);
  }

  function handleRenameUserProgs(value, index) {
    let newProgs = structuredClone(userProgs);
    newProgs[index] = value;
    setUserProgs(newProgs);
  }

  function handleReset() {
    setUserProgs(SYSTEM_DEFAULT_PROGS);
  }

  return (
    <>
      {/* FOR DEVELOPMENT */}
      {/* <ul>
        {lists.map((list) => (
          <li key={list.id}>{`${list.itemIds}`}</li>
        ))}
      </ul> */}
      <ManagerContext.Provider
        value={{
          lists,
          items,
          config,
          handleImportBoard,
          userProgs,
          handleRenameUserProgs,
          handleReset,
          changeConfig,
          resetConfig,
        }}
      >
        <Navbar />
      </ManagerContext.Provider>

      <article className="my-[1lh] flex max-w-dvw flex-col md:mx-[1ch]">
        {/* TODO: wait do I really want the logo and the board header to be semantically combined */}
        <header className="mb-[1lh] flex flex-row gap-[1ch] md:mb-auto">
          {/* <Ascii text="csfa" /> */}
          {/* <div className="flex w-full flex-col gap-[0.5lh] md:w-[60ch]">
            <Roulette items={items} />
            <NewListForm onAddList={handleAddList} />
          </div> */}
        </header>

        <ManagerContext.Provider
          value={{
            items,
            lists,
            handleAddItem,
            handleDeleteList,
            handleRenameList,
            handleCollapseList,
            handleGroupList,
            handleMoveList,
            handleDeleteItem,
            handleRenameItem,
            handleAdvanceItem,
            handleRenameListProgs,
            onDragEnd,
          }}
        >
          <Board />
          {/* <Pomo config={config} /> */}
        </ManagerContext.Provider>
      </article>
    </>
  );
}

function NewListForm({ onAddList }) {
  const clearform = useRef("");

  return (
    <form
      onSubmit={onAddList}
      autoComplete="off"
      className="flex flex-col md:flex-row"
    >
      <input
        className="w-full min-w-0"
        type="text"
        name="newList"
        minLength="0"
        maxLength="99"
        ref={clearform}
      ></input>
      <button
        size-="small"
        type="submit"
        className="w-full self-center md:w-[21ch]"
      >
        [Add List]
      </button>
    </form>
  );
}
