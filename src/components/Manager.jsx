import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ManagerContext } from "./Contexts";
import Navbar from "./Navbar";
import Board from "./Board.jsx";
import Sidebar from "./Sidebar.jsx";

import {
  SYSTEM_CONFIG_STAGES,
  SYSTEM_CONFIG_POMODORO,
  // ONLY FOR DEVELOPMENT
  devItems,
  devLists,
} from "./systemconfig";

// TODO: change to functions? I don't use function consts anywhere, I just copied these from a code example.
// TODO: move elsewhere? Having these floating outside components is weird

// IMPORTANT dnd logic
// When item is reordered within the same list
const reorder = (itemIds, SIind, DIind) => {
  const result = structuredClone(itemIds);
  const [removed] = result.splice(SIind, 1);
  result.splice(DIind, 0, removed);

  return result;
};

// When item is moved to another list
const move = (SLobj, DLobj, source, destination) => {
  const SLclone = structuredClone(SLobj);
  const DLclone = structuredClone(DLobj);

  const [removed] = SLclone.itemIds.splice(source.index, 1);
  DLclone.itemIds.splice(destination.index, 0, removed);
  const result = {};
  result[source.droppableId] = SLclone;
  result[destination.droppableId] = DLclone;

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
  // If user doesn't have config in localstorage, load system config
  const [stagesConfig, setStagesConfig] = useState(() => {
    const loadStagesConfig = JSON.parse(localStorage.getItem("stages-config"));
    return loadStagesConfig || SYSTEM_CONFIG_STAGES;
  });
  const [pomoConfig, setPomoConfig] = useState(() => {
    const loadPomoConfig = JSON.parse(localStorage.getItem("pomo-config"));
    return loadPomoConfig || SYSTEM_CONFIG_POMODORO;
  });

  // AUDIT++: see what can be done to optimize
  // Will possibly migrate db to dexie anyway?
  // Update localstorage
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("stages-config", JSON.stringify(stagesConfig));
  }, [stagesConfig]);

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
  function onDragEnd(drop) {
    // drop: special object of @hello-pangea/dnd
    // source, destination: object {index: index of item in itemIds (number), droppableId: index of List (numeric string)}
    const { source, destination } = drop;

    // Exit if didn't drop at a destination
    if (!destination) {
      return;
    }
    // SLind: Source List index
    // DLind: Destination List index
    // SIind: Source (og) Item index
    // DIind: Destination (next) Item index
    // interpret simply as you see with your eyes. "I move item from 2 to 0" is 2 0
    const SLind = +source.droppableId;
    const DLind = +destination.droppableId;
    const SIind = source.index;
    const DIind = destination.index;

    // If source and destionation List index are identical > reorder operation
    if (SLind === DLind) {
      // SLobj: Source List object
      // DLobj: Destination List object
      const SLobj = lists[SLind];
      // update: array next itemIds
      const update = reorder(SLobj.itemIds, SIind, DIind);
      setLists(
        lists.map((list, index) => {
          if (index !== SLind) return list;
          else return { ...list, itemIds: update };
        }),
      );
      // If source and destionation List index are different > move operation
    } else {
      const SLobj = lists[SLind];
      const DLobj = lists[DLind];
      // update: object {object next source List, object next destination List}
      const update = move(SLobj, DLobj, source, destination);
      const newLists = [...lists];
      newLists[SLind] = update[SLind];
      newLists[DLind] = update[DLind];
      setLists(newLists);

      // Lists can have different stages. Moving an item can cause a conflict if its stage is higher than destination's. Always check after moving and reset conflict stages to 0
      const targetitem = items.find((item) => item.id === SLobj.itemIds[SIind]);
      if (targetitem.stage >= DLobj.stages.length) {
        setItems(
          items.map((item) => {
            if (item !== targetitem) return item;
            else return { ...item, stage: 0 };
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
        stages: stagesConfig,
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
        stage: 0,
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
      newOrder[item.stage].push(item.id);
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
  // nextSize is num of COLORED stages
  function handleResizeListStages(nextSize, listStages, listId, myItems) {
    // First resolve conflicts with Items' stages
    setItems(
      items.map((item) => {
        // skip Items not in List
        if (myItems.includes(item) === false) return item;
        else {
          // Reset conflicting stage
          if (item.stage > nextSize) return { ...item, stage: 0 };
          else return item;
        }
      }),
    );

    const size = listStages.length - 1;
    // If received form input =/= stages size
    if (nextSize !== size) {
      let nextStages;
      if (nextSize > size) {
        // Copy existing stages + append empty array (unnamed) of length diff
        nextStages = [...listStages, ...Array(nextSize - size).fill("")];
      } else if (nextSize < size) {
        // Remove length diff
        nextStages = listStages.slice(0, nextSize - size);
      }
      // Note: we can't simply append or delete one because a slider can be clicked anywhere and not just moved
      setLists(
        lists.map((list) => {
          if (list.id !== listId) return list;
          else return { ...list, stages: nextStages };
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
          let newStages = structuredClone(list.stages);
          newStages[index] = input;
          return { ...list, stages: newStages };
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
  function handleAdvanceItem(itemId, stages) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        else {
          // Max stage loops back to stage 0
          if (item.stage === stages.length - 1) return { ...item, stage: 0 };
          else return { ...item, stage: item.stage + 1 };
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

  // Resize Config Stages
  // nextSize is num of COLORED stages
  function handleResizeConfigStages(nextSize) {
    const size = stagesConfig.length - 1;
    if (nextSize !== size) {
      if (nextSize > size) {
        const newStages = [...stagesConfig, ...Array(nextSize - size).fill("")];
        setStagesConfig(newStages);
      } else if (nextSize < size) {
        const newStages = stagesConfig.slice(0, nextSize - size);
        setStagesConfig(newStages);
      }
    }
  }

  // Rename Config Stages
  function handleRenameConfigStages(input, index) {
    let newStages = structuredClone(stagesConfig);
    newStages[index] = input;
    setStagesConfig(newStages);
  }

  // Reset Board Config
  function resetBoardConfig() {
    // Reset config stages
    // Doesn't do anything else because it's the only Board setting now
    setStagesConfig(SYSTEM_CONFIG_STAGES);
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
          stagesConfig,
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
