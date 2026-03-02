import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ManagerContext } from './ManagerContext';

import Item from './Item';
import List from './List';
import Roulette from './Roulette';
import Header from './Header';

function NewListForm({ newList }) {
  return (
    <form
      onSubmit={newList}
      autoComplete="off"
    >
      <input
        className="w-full"
        type="text"
        name="newList"
        required
      ></input>
      <button
        type="submit"
        className="w-full"
      >
        [New List]
      </button>
    </form>
  );
}

export default function Manager() {
  // COMMENTED OUT FOR DEVELOPMENT
  // load localstorage
  // const [items, setItems] = useState(() => {
  //   const loadItemsDb = JSON.parse(localStorage.getItem("itemsdb"));
  //   return loadItemsDb || [];
  // });
  // const [lists, setLists] = useState(() => {
  //   const loadListsDb = JSON.parse(localStorage.getItem("listsdb"));
  //   return loadListsDb || [];
  // });

  // FOR DEVELOPMENT
  const [items, setItems] = useState([
    { name: uuidv4().substring(0, 8), progress: 1, id: '1' },
    {
      name: uuidv4(),
      progress: 4,
      id: '2',
    },
    { name: uuidv4().substring(0, 8), progress: 5, id: '3' },
    {
      name: uuidv4(),
      progress: 5,
      id: '4',
    },
    { name: uuidv4().substring(0, 8), progress: 2, id: '6' },
    { name: uuidv4().substring(0, 8), progress: 4, id: '7' },
    { name: uuidv4().substring(0, 8), progress: 6, id: '8' },
    { name: uuidv4().substring(0, 8), progress: 6, id: '9' },
  ]);
  const [lists, setLists] = useState([
    {
      name: uuidv4(),
      id: uuidv4(),
      itemIds: ['1', '2', '4', '9'],
      visible: true,
    },
    { name: uuidv4(), id: uuidv4(), itemIds: ['3', '8'], visible: true },
    {
      name: uuidv4(),
      id: uuidv4(),
      itemIds: [],
      visible: true,
    },
    { name: uuidv4(), id: uuidv4(), itemIds: [], visible: true },
    {
      name: uuidv4(),
      id: uuidv4(),
      itemIds: ['6', '7'],
      visible: true,
    },
  ]);

  useEffect(() => {
    localStorage.setItem('itemsdb', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('listsdb', JSON.stringify(lists));
  }, [lists]);

  function handleAddList(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newList = formData.get('newList');
    setLists([
      ...lists,
      {
        name: newList,
        id: uuidv4(),
        itemIds: [],
        visible: true,
      },
    ]);
  }

  function handleAddItem(event) {
    event.preventDefault();
    const newItemId = uuidv4();
    const formData = new FormData(event.currentTarget);
    const newItem = formData.get('newItem');
    const originListId = formData.get('originListId');
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
          return { ...list, itemIds: [...list.itemIds, newItemId] };
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
    const newListName = formData.get('newListName');
    const listId = formData.get('listId');
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
    const newItemName = formData.get('newItemName');
    const itemId = formData.get('itemId');
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

  function exportData() {
    // file object
    const file = new Blob([JSON.stringify({ lists: lists, items: items })], {
      type: 'application/json',
    });
    // anchor link
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'csfa-' + Date.now() + '.json';
    // simulate link click
    document.body.appendChild(element);
    // Required for this to work in FireFox
    element.click();
  }

  // TODO: validation
  function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      // console.log(data);

      setLists(data.lists);
      setItems(data.items);
    };
    reader.readAsText(file);
  }

  return (
    <div className="manager">
      {/* TODO: I don't think it should be here */}
      <Header
        exportData={exportData}
        importData={importData}
      />

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))] gap-[2ch]">
        <div>
          <Roulette items={items} />
          <NewListForm newList={handleAddList} />
        </div>
        {/* TODO: slightly mismatched at breakpoint! */}
        <div className="hidden md:block">
          cool placeholder to fill out space
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
        }}
      >
        <ul className="lists grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))] gap-[2ch]">
          {lists.map((list) => (
            <li key={list.id}>
              <List list={list} />
            </li>
          ))}
        </ul>
      </ManagerContext.Provider>
    </div>
  );
}
