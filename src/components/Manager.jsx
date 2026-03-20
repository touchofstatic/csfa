import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext } from "@hello-pangea/dnd";
import { ManagerContext } from "./Contexts";
import List from "./List";
import Roulette from "./Roulette";
import Navbar from "./Navbar";
import Ascii from "./Ascii";

// FOR DEVELOPMENT
import { itemsdb, listsdb } from "./data";

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

const RANGE_SYSTEM_DEFAULT = [
  "unspecified",
  "queued",
  "priority",
  "working",
  "submitted",
  "approved",
  "done",
];

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

  useEffect(() => {
    localStorage.setItem("listsdb", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("itemsdb", JSON.stringify(items));
  }, [items]);

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
        range: RANGE_SYSTEM_DEFAULT,
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

  function handleRenameRange(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRange = ["unspecified"].concat(formData.getAll("progress"));
    const listId = formData.get("listId");
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        else {
          return { ...list, range: newRange };
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

  // TODO: validation
  function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = JSON.parse(event.target.result);

      setLists(data.lists);
      setItems(data.items);
    };
    reader.readAsText(file);
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
          importData,
        }}
      >
        <Navbar />
      </ManagerContext.Provider>

      <div className="my-[1lh] flex max-w-dvw flex-col md:mx-[1ch]">
        <div className="mb-[1lh] flex flex-row gap-[1ch] md:mb-auto">
          <Ascii text="csfa" />
          <div className="flex w-full flex-col gap-[0.5lh] md:w-[60ch]">
            <Roulette items={items} />
            <NewListForm onAddList={handleAddList} />
          </div>
        </div>

        <ManagerContext.Provider
          value={{
            items,
            handleAddItem,
            handleDeleteList,
            handleRenameList,
            handleCollapseList,
            handleDeleteItem,
            handleRenameItem,
            handleAdvanceItem,
            handleRenameRange,
          }}
        >
          <div className="grid gap-[1ch] sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(37ch,_1fr))]">
            <DragDropContext onDragEnd={onDragEnd}>
              {lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
            </DragDropContext>
            {/* List auto-fit control placeholders because I'm a shameful being */}
            {/* TODO: HIDE ACCESSIBLY */}
            {lists.length <= 2 && (
              <div className="hidden md:invisible md:block">lmao</div>
            )}
            {lists.length === 1 && (
              <div className="hidden md:invisible md:block">lmao</div>
            )}
          </div>
        </ManagerContext.Provider>
      </div>
    </>
  );
}

function NewListForm({ onAddList }) {
  const clearform = useRef("");

  return (
    <form
      onSubmit={onAddList}
      autoComplete="off"
      className="flex flex-col gap-[0.5lh] md:flex-row md:gap-[1ch]"
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
