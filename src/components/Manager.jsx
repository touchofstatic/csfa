import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ManagerContext } from "./Contexts";
import Navbar from "./Navbar";
import Board from "./Board.jsx";
import Sidebar from "./Sidebar.jsx";

// FOR DEVELOPMENT
import {
  itemsdb,
  listsdb,
  userProgsConfig,
  userPomoConfig,
  SYSTEM_DEFAULT_PROGS,
  SYSTEM_DEFAULT_POMO,
} from "./data";

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
  const [userProgs, setUserProgs] = useState(userProgsConfig);
  const [userPomo, setUserPomo] = useState(userPomoConfig);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("userProgs", JSON.stringify(userProgs));
  }, [userProgs]);

  useEffect(() => {
    localStorage.setItem("userPomo", JSON.stringify(userPomo));
  }, [userPomo]);

  function changePomoConfig(value, name) {
    if (name === "pomo" || name === "short" || name === "long")
      setUserPomo({ ...userPomo, [name]: Number(value) * 60 });
    if (name === "volume") setUserPomo({ ...userPomo, volume: value });
    if (name === "interval") setUserPomo({ ...userPomo, interval: value });
    if (name === "auto") {
      if (value === "yes") setUserPomo({ ...userPomo, autoStart: true });
      if (value === "no") setUserPomo({ ...userPomo, autoStart: false });
    }
  }

  function resetPomoConfig() {
    setUserPomo({
      pomo: SYSTEM_DEFAULT_POMO.pomo,
      short: SYSTEM_DEFAULT_POMO.short,
      long: SYSTEM_DEFAULT_POMO.long,
      interval: SYSTEM_DEFAULT_POMO.interval,
      autoStart: SYSTEM_DEFAULT_POMO.autoStart,
      volume: SYSTEM_DEFAULT_POMO.volume,
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

      // validate item progress at new boundary
      const targetitem = items.find(
        (item) => item.id === lists[sInd].itemIds[source.index],
      );
      if (targetitem.progress >= lists[dInd].progs.length) {
        setItems(
          items.map((item) => {
            if (item !== targetitem) return item;
            else return { ...item, progress: 0 };
          }),
        );
      }
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
    let newOrder = [[], [], [], [], [], [], [], []];
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

  function handleResizeListProgs(value, listProgs, listId, myItems) {
    // validate items' progress above new boundary
    setItems(
      items.map((item) => {
        if (myItems.includes(item) === false) return item;
        else {
          if (item.progress > value) return { ...item, progress: 0 };
          else return item;
        }
      }),
    );

    const oldValue = listProgs.length - 1;
    if (value !== oldValue) {
      let newProgs;
      if (value > oldValue) {
        newProgs = [...listProgs, ...Array(value - oldValue).fill("")];
      } else if (value < oldValue) {
        newProgs = listProgs.slice(0, value - oldValue);
      }
      setLists(
        lists.map((list) => {
          if (list.id !== listId) return list;
          else return { ...list, progs: newProgs };
        }),
      );
    }

    // let newProgs = structuredClone(listProgs);
    // if (value > listProgs.length - 1) newProgs.push("");
    // else if (value < listProgs.length - 1) newProgs.pop();
    // setLists(
    //   lists.map((list) => {
    //     if (list.id !== listId) return list;
    //     else return { ...list, progs: newProgs };
    //   }),
    // );
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

  function handleAdvanceItem(itemId, progs) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          if (item.progress === progs.length - 1)
            return { ...item, progress: 0 };
          else return { ...item, progress: item.progress + 1 };
        }
      }),
    );
  }

  function handleImportBoard(lists, items) {
    setLists(lists);
    setItems(items);
  }

  // value is the number of colored progress, in user controls
  // userProgs.length is 6 = value is 5
  function handleResizeUserProgs(value) {
    const oldValue = userProgs.length - 1;
    if (value !== oldValue) {
      if (value > oldValue) {
        const newProgs = [...userProgs, ...Array(value - oldValue).fill("")];
        setUserProgs(newProgs);
      } else if (value < oldValue) {
        const newProgs = userProgs.slice(0, value - oldValue);
        setUserProgs(newProgs);
      }
    }

    // if (value > userProgs.length - 1) newProgs.push("");
    // else if (value < userProgs.length - 1) newProgs.pop();
    // setUserProgs(newProgs);
  }

  function handleRenameProgs(value, index) {
    let newProgs = structuredClone(userProgs);
    newProgs[index] = value;
    setUserProgs(newProgs);
  }

  function resetSettingsConfig() {
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
          items,
          lists,
          userProgs,
          userPomo,
          handleImportBoard,
          handleResizeUserProgs,
          handleRenameProgs,
          resetSettingsConfig,
          changePomoConfig,
          resetPomoConfig,
        }}
      >
        <Navbar />
      </ManagerContext.Provider>

      {/* <body>... 2!!! */}
      <div className="mx-[1ch] my-[1lh] flex max-w-dvw flex-col gap-[1ch] md:flex-row">
        <ManagerContext.Provider
          value={{
            items,
            lists,
            userPomo,
            handleAddList,
            handleAddItem,
            handleDeleteList,
            handleRenameList,
            handleCollapseList,
            handleGroupList,
            handleMoveList,
            handleDeleteItem,
            handleRenameItem,
            handleAdvanceItem,
            handleResizeListProgs,
            handleRenameListProgs,
            onDragEnd,
          }}
        >
          <Sidebar />
          <Board />
        </ManagerContext.Provider>
      </div>
    </>
  );
}
