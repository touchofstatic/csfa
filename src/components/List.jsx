import { useState, useContext } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { ManagerContext } from './Contexts';
import styles from '../styles/list.module.css';
import idk from '../styles/idk.module.css';
import Item from './Item';

import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

export default function List({ list, index, children }) {
  const [draftRenameList, setDraftRenameList] =
    useState('');
  const ref = useClickAway(() => {
    setDraftRenameList('');
  });

  const {
    items,
    handleAddItem,
    handleDeleteList,
    handleRenameList,
    handleCollapseList,
    handleRenameRange,
  } = useContext(ManagerContext);

  const myItems = list.itemIds
    .map((key) => items.find((item) => item.id === key))
    .filter(Boolean);

  // TODO: bad?
  let title = '';
  if (!draftRenameList) {
    title = (
      <div className={`${styles.name}`}>{list.name}</div>
    );
  } else {
    title = (
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          handleRenameList(event);
          setDraftRenameList('');
        }}
        autoComplete="off"
      >
        <input
          type="hidden"
          name="listId"
          value={list.id}
        ></input>
        <input
          type="text"
          name="newListName"
          minlength="0"
          maxlength="99"
          className="w-full"
          defaultValue={draftRenameList}
          autoFocus
        />
        <span className="flex gap-[1ch]">
          <button
            type="button"
            className="w-full"
            size-="small"
            onClick={(event) => {
              event.preventDefault();
              setDraftRenameList('');
            }}
          >
            [c]
          </button>
          <button
            className="w-full"
            size-="small"
            type="submit"
          >
            [rn]
          </button>
        </span>
      </form>
    );
  }

  return (
    <div
      className={`p-[1ch] h-fit flex flex-col ${!list.visible ? `${styles.collapsed} border-2 border-[var(--background1)] hover:border-[var(--background3)]` : 'border-2 border-[var(--background2)] hover:border-[var(--foreground1)]'}`}
    >
      <header
        className={`${!list.visible ? `${styles.collapsed}` : ''} noselect`}
      >
        {title}
        <div>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''} p-0`}
            size-="small"
            onClick={() =>
              handleDeleteList(list.id, myItems)
            }
          >
            [-]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''} p-0`}
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            [rn]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''} p-0`}
            size-="small"
            command="show-modal"
            commandfor={`settings-dialog-${list.id}`}
          >
            [s]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''} p-0`}
            size-="small"
            onClick={() => handleCollapseList(list.id)}
          >
            {list.visible ? `[▼]` : `[▲]`}
          </button>

          <span> | {myItems.length} items</span>
          {/* <div className="flex w-full min-w-full">
            <span className="bg-[var(--color0)] w-full">&nbsp;10&nbsp;</span>
            <span className="bg-[var(--color1)] w-full">&nbsp;25&nbsp;</span>
            <span className="bg-[var(--color2)] w-full">&nbsp;30&nbsp;</span>
            <span className="bg-[var(--color3)] w-full">&nbsp;40&nbsp;</span>
            <span className="bg-[var(--color4)] w-full">&nbsp;50&nbsp;</span>
            <span className="bg-[var(--color5)] w-full">&nbsp;10&nbsp;</span>
          </div> */}
        </div>
      </header>

      <hr
        className={`${styles.separator} ${!list.visible ? `${styles.collapsed}` : ''}`}
      ></hr>

      <Droppable
        key={list.id}
        droppableId={`${index}`}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${snapshot.isDraggingOver ? `${styles.over}` : ``}`}
          >
            {myItems.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided) => (
                  <div
                    key={item.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {list.visible && (
                      <Item
                        item={item}
                        myListId={list.id}
                        range={list.range}
                        index={index}
                      />
                    )}
                    {children}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form
        className={`mt-[1ch] flex gap-[1ch]`}
        onSubmit={(event) => {
          event.preventDefault();
          handleAddItem(event);
        }}
        autoComplete="off"
      >
        <input
          type="hidden"
          name="originListId"
          value={list.id}
        />
        <input
          className="w-full min-w-0"
          type="text"
          name="newItem"
          minlength="1"
          maxlength="99"
          required
        />
        <button
          size-="small"
          type="submit"
          className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ''} whitespace-nowrap`}
        >
          [+]
        </button>
      </form>

      <dialog
        className={`h-4/5 md:h-[30ch] w-full`}
        id={`settings-dialog-${list.id}`}
        popover="true"
      >
        <article
          className={`flex flex-col align-center justify-center h-full ${idk.idk}`}
          box-="double"
        >
          <form
            className={`flex flex-col`}
            onSubmit={(event) => {
              handleRenameRange(event);
            }}
            autoComplete="off"
          >
            <input
              type="hidden"
              name="listId"
              value={list.id}
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[1]}
              className={`${styles.progress1}`}
              required
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[2]}
              className={styles.progress2}
              required
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[3]}
              className={styles.progress3}
              required
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[4]}
              className={styles.progress4}
              required
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[5]}
              className={styles.progress5}
              required
            />
            <input
              type="text"
              name="progress"
              minlength="1"
              maxlength="12"
              defaultValue={list.range[6]}
              className={styles.progress6}
              required
            />
            <button
              type="submit"
              size-="small"
            >
              Save
            </button>
          </form>
          <div className="flex justify-center">
            <button
              commandfor={`settings-dialog-${list.id}`}
              command="close"
            >
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </div>
  );
}
