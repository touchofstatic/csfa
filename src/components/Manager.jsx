import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ManagerContext } from "./Contexts";
import Navbar from "./Navbar";
import Board from "./Board.jsx";
import Sidebar from "./Sidebar.jsx";

// !!!! TODO: change progs to stages
// !!! TODO: resolve "visible" and "collapsed"

// ONLY FOR DEVELOPMENT
import {
  devItems,
  devLists,
  SYSTEM_DEFAULT_STAGES,
  SYSTEM_CONFIG_POMODORO,
} from "./data";

// TODO: change to functions? I don't use function consts anywhere, I just copied these from a code example.
// TODO: move elsewhere? Having these floating outside components is weird
// TODO: Not very descriptive names or variables.

// IMPORTANT dnd logic

// When item is reordered within the same list
// itemIds: array itemIds of source List
// interpret ogIndex and nextIndex simply as you see it with your eyes. "I move item from 2 to 0" is 2 0
// result: next array itemIds
const reorder = (itemIds, ogIndex, nextIndex) => {
  const result = structuredClone(itemIds);
  const [removed] = result.splice(ogIndex, 1);
  result.splice(nextIndex, 0, removed);

  return result;
};

// When item is moved to another list
// source: object source List
// destination: object destination List
// droppableSource, droppableDestination: object {index: index of item in itemIds (number), droppableId: index of List (numeric string)}
// result: object {object next source List, object next destination List}
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
  const [items, setItems] = useState(() => {
    const loadItems = JSON.parse(localStorage.getItem("items"));
    // return loadItems || [];
    // FOR DEVELOPMENT
    return loadItems || devItems;
  });
  const [lists, setLists] = useState(() => {
    const loadLists = JSON.parse(localStorage.getItem("lists"));
    // return loadLists || [];
    // FOR DEVELOPMENT
    return loadLists || devLists;
  });
  // TODO: those names suck
  // If user doesn't have settings in localstorage, load default settings
  const [userProgs, setUserProgs] = useState(() => {
    const loadUserProgsConfig = JSON.parse(
      localStorage.getItem("userProgsConfig"),
    );
    return loadUserProgsConfig || SYSTEM_DEFAULT_STAGES;
  });
  const [pomoConfig, setPomoConfig] = useState(() => {
    const loadPomoConfig = JSON.parse(localStorage.getItem("pomo-config"));
    return loadPomoConfig || SYSTEM_CONFIG_POMODORO;
  });

  // TODO: see what can be done to optimize
  // Will possibly migrate db to dexie anyway?
  // Update localstorage
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("userProgsConfig", JSON.stringify(userProgs));
  }, [userProgs]);

  useEffect(() => {
    localStorage.setItem("pomo-config", JSON.stringify(pomoConfig));
  }, [pomoConfig]);

  // Change pomodoro config
  function changePomoConfig(value, name) {
    // Countdowns
    if (name === "pomo" || name === "short" || name === "long") {
      // Second validations because mobile users bypass input length limits for some reason
      // 0 <= minutes <= 59
      if (value > 59) setPomoConfig({ ...pomoConfig, [name]: 59 * 60 });
      else if (value < 0) setPomoConfig({ ...pomoConfig, [name]: 0 });
      else setPomoConfig({ ...pomoConfig, [name]: Number(value) * 60 });
    }
    // Interval
    if (name === "interval") {
      setPomoConfig({ ...pomoConfig, interval: value });
    }
    // Auto start
    if (name === "auto") {
      if (value === "yes") setPomoConfig({ ...pomoConfig, autoStart: true });
      if (value === "no") setPomoConfig({ ...pomoConfig, autoStart: false });
    }
    // Volume slider
    if (name === "volume") setPomoConfig({ ...pomoConfig, volume: value });
  }

  // Reset pomodoro config
  function resetPomoConfig() {
    setPomoConfig({
      pomo: SYSTEM_CONFIG_POMODORO.pomo,
      short: SYSTEM_CONFIG_POMODORO.short,
      long: SYSTEM_CONFIG_POMODORO.long,
      interval: SYSTEM_CONFIG_POMODORO.interval,
      autoStart: SYSTEM_CONFIG_POMODORO.autoStart,
      volume: SYSTEM_CONFIG_POMODORO.volume,
    });
  }

  // Dnd utility
  // result: special object of @hello-pangea/dnd
  // source, destination: object {index: index of item in itemIds (number), droppableId: index of List (numeric string)}
  // sInd: index of source List
  // dInd: index of destination List

  // TODO: totally inconsistent var naming with reorder and move??
  function onDragEnd(result) {
    const { source, destination } = result;

    // Exit if dnd didn't end at a destination
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    // If source and destionation List index are identical > reorder operation
    if (sInd === dInd) {
      // TODO: THIS IS TOTALLY CONFUSING
      // result: next array itemIds
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
      // If source and destionation List index are different > move operation
    } else {
      // result: object {object next source List, object next destination List}
      const result = move(lists[sInd], lists[dInd], source, destination);
      const newLists = [...lists];
      newLists[sInd] = result[sInd];
      newLists[dInd] = result[dInd];
      setLists(newLists);

      // Lists can have different stages. Moving an item can cause a conflict if its stage is higher than destination's. Always check after moving and reset conflict stages to 0
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

  // Add List
  function handleAddList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let newList = formData.get("newList");
    // Empty List name is allowed
    if (newList === "") newList = "Untitled";
    // Reset input
    event.target.reset();
    // Lists are created with stages specified in user board config
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

  // Add Item
  function handleAddItem(event) {
    event.preventDefault();
    const newItemId = uuidv4();
    const formData = new FormData(event.currentTarget);
    const newItem = formData.get("newItem");
    // Reset input
    const originListId = formData.get("originListId");
    event.target.reset();
    // Update Items
    setItems([
      ...items,
      {
        name: newItem,
        progress: 0,
        id: newItemId,
      },
    ]);
    // Update Lists to add new Item's id to its origin list itemIds
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

  // Delete List
  function handleDeleteList(listId, myItems) {
    // Kill List's Items
    setItems(items.filter((item) => myItems.includes(item) === false));
    // Delete List
    setLists(lists.filter((list) => list.id !== listId));
  }

  // Rename List
  function handleRenameList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let newListName = formData.get("newListName");
    // Empty List name is allowed
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

  // Collapse List
  // TODO: it makes no sense that list is "visible" but class is "collapsed"
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

  // Order List by stages
  function handleOrderList(listId, myItems) {
    // We simply put item in its numbered stage box. There's no need to actually compare and shuffle them. It also preserves items' order otherwise
    let newOrder = [[], [], [], [], [], [], [], []];
    myItems.map((item) => {
      newOrder[item.progress].push(item.id);
    });
    // Stage 0 items go to bottom
    newOrder.push(newOrder.shift());
    // newOrder is flattened into an itemIds type array and empty boxes are removed
    newOrder = newOrder.flat();
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else return { ...list, itemIds: newOrder };
      }),
    );
  }

  // Move List
  // It's not dnd because that would be awful on every level
  function handleMoveList(index, direction) {
    // Create changed lists where target List is inserted at corresponding index
    const newLists = structuredClone(lists);
    if (direction === "up" && index > 0) {
      const [target] = newLists.splice(index, 1);
      newLists.splice(index - 1, 0, target);
    }
    if (direction === "down" && index < lists.length) {
      const [target] = newLists.splice(index, 1);
      newLists.splice(index + 1, 0, target);
    }
    setLists(newLists);
  }

  // Resize List's Stages
  // TODO: non descriptive variable names, especially "value"
  function handleResizeListStages(value, listProgs, listId, myItems) {
    // First resolve conflicts with Items' and List's new stages
    setItems(
      items.map((item) => {
        // skip Items not in List
        if (myItems.includes(item) === false) return item;
        else {
          // Reset conflicting stage
          if (item.progress > value) return { ...item, progress: 0 };
          else return item;
        }
      }),
    );

    //!!!!!! TODO: this is so freaking confusing I can't even comment it
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
  }

  // Rename List's Stages
  function handleRenameListStages(input, index, listId) {
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else {
          let newProgs = structuredClone(list.progs);
          newProgs[index] = input;
          return { ...list, progs: newProgs };
        }
      }),
    );
  }

  // Delete Item
  function handleDeleteItem(itemId, myListId) {
    setItems(items.filter((item) => item.id !== itemId));
    // Delete Item's id from origin List's itemIds
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

  // Rename Item
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

  // Advance Item
  function handleAdvanceItem(itemId, progs) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          // Max stage loops back to stage 0
          if (item.progress === progs.length - 1)
            return { ...item, progress: 0 };
          else return { ...item, progress: item.progress + 1 };
        }
      }),
    );
  }

  // Import Board
  // Majority of function happens in Import child component, Manager only receives data that was read, destructured, and validated by it
  function handleImportBoard(lists, items) {
    setLists(lists);
    setItems(items);
  }

  // TODO: TERRIBLE NAMES AGAIN CONFUSING INTERACTION
  // I'm nto even gonna comment this
  // Resize Config Stages
  // value is the number of colored progress, in user controls
  // userProgs.length is 6 = value is 5
  function handleResizeConfigStages(value) {
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
  }

  // Rename Config Stages
  function handleRenameConfigStages(input, index) {
    let newProgs = structuredClone(userProgs);
    newProgs[index] = input;
    setUserProgs(newProgs);
  }

  // Reset Board Config
  function resetBoardConfig() {
    // Reset config stages
    // Doesn't do anything else because it's the only Board setting now
    setUserProgs(SYSTEM_DEFAULT_STAGES);
  }

  return (
    <>
      {/* FOR DEVELOPMENT: display lists and itemIds in readable form */}
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
          pomoConfig,
          handleImportBoard,
          handleResizeConfigStages,
          handleRenameConfigStages,
          resetBoardConfig,
          changePomoConfig,
          resetPomoConfig,
        }}
      >
        <Navbar />
      </ManagerContext.Provider>

      {/* <body>... 2!!!
      IMPORTANT: load bearing for flow. I forgot why */}
      <div className="mx-[1ch] my-[1lh] flex max-w-dvw flex-col gap-[1ch] md:flex-row">
        <ManagerContext.Provider
          value={{
            items,
            lists,
            pomoConfig,
            handleAddList,
            handleAddItem,
            handleDeleteList,
            handleRenameList,
            handleCollapseList,
            handleOrderList,
            handleMoveList,
            handleDeleteItem,
            handleRenameItem,
            handleAdvanceItem,
            handleResizeListStages,
            handleRenameListStages,
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
