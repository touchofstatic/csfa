import { useState, useContext, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/list.module.css";

import Item from "./Item";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function List({ list, index, children }) {
  const [draftRenameList, setDraftRenameList] = useState("");

  const {
    items,
    handleAddItem,
    handleDeleteList,
    handleRenameList,
    handleCollapseList,
    handleOrderList,
    handleMoveList,
    handleResizeListStages,
    handleRenameListStages,
  } = useContext(ManagerContext);

  // Clicking outside ends the rename interaction
  const ref = useClickAway(() => {
    setDraftRenameList("");
  });

  // ref to clear form text after submit
  const clearform = useRef("");

  // Reconstruct list's items from its itemIds. We list.itemIds.map instead of just searching items where item.key is in itemIds to preserve the order they're in itemIds. I don't remember why .filter(Boolean) but it must've been important
  const myItems = list.itemIds
    .map((key) => items.find((item) => item.id === key))
    .filter(Boolean);

  // TODO: not sure if bad or okay. ask later
  let title = "";
  // If not renaming, display name normally
  if (!draftRenameList) {
    title = (
      <div className={`${styles.name} breakword font-[700]`}>{list.name}</div>
    );
    // If renaming, display the form in its place
  } else {
    title = (
      <form
        ref={ref}
        onSubmit={(event) => {
          handleRenameList(event);
          setDraftRenameList("");
        }}
        autoComplete="off"
      >
        <input type="hidden" name="listId" value={list.id}></input>
        <input
          type="text"
          name="newListName"
          minLength="0"
          maxLength="99"
          className="w-full"
          defaultValue={draftRenameList}
          autoFocus
        />
        <span className="my-[0.25lh] flex gap-[1ch]">
          <button
            className="w-full hover:not-active:bg-[var(--foreground1)]"
            size-="small"
            type="submit"
          >
            [Save]
          </button>
          <button
            type="button"
            className="w-full hover:not-active:bg-[var(--foreground1)]"
            size-="small"
            onClick={(event) => {
              event.preventDefault();
              setDraftRenameList("");
            }}
          >
            [Cancel]
          </button>
        </span>
      </form>
    );
  }

  return (
    // Border imitates the webtui box utility. We didn't use box because it'd be more complicated especially with moving parts of dnd. And it highlights on hover!
    <div
      className={`flex h-fit flex-col p-[1ch] ${!list.visible ? `${styles.collapsed} border-2 border-[var(--background1)] hover:border-[var(--background3)]` : "border-2 border-[var(--background2)] hover:border-[var(--foreground1)]"}`}
    >
      <header className={`${!list.visible ? `${styles.collapsed}` : ""}`}>
        {title}
        {/* List controls */}
        <div>
          {/* Settings */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            command="show-modal"
            commandfor={`config-board-dialog-${list.id}`}
          >
            [s]
          </button>
          {/* Rename */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            [rn]
          </button>
          {/* Delete */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
          >
            [-]
          </button>
          {/* Collapse */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleCollapseList(list.id)}
          >
            {list.visible ? `[▼]` : `[▲]`}
          </button>
          {/* Move up */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "up")}
          >
            [↑]
          </button>
          {/* Move down */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "down")}
          >
            [↓]
          </button>
          {/* Order by stage */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleOrderList(list.id, myItems)}
          >
            [o]
          </button>
        </div>
      </header>

      <hr
        className={`${styles.separator} ${!list.visible ? `${styles.collapsed}` : ""}`}
      ></hr>

      {/* IMPORTANT: don't touch dnd logic or it will explode. Nested divs here are for specific needs of @hello-pangea/dnd library. There's barely any relevant code examples on the internet and the documentation is painful and still uses React class components so just be thankful that it works. */}
      {/* Important: watch out for fragile dnd interaction w/ grid/height/border when a list item is picked up, hovered, or dropped */}
      {/* Items droppable area begins below separator and ends before add item form */}
      <Droppable key={list.id} droppableId={`${index}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {/* IMPORTANT: seriously don't mess with placement of {children} and {provided.placeholder} */}
            {myItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    key={item.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    {/* Don't display items if list is collapsed */}
                    {list.visible && (
                      <Item
                        item={item}
                        myListId={list.id}
                        stages={list.stages}
                        index={index}
                        {...provided.dragHandleProps}
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
          handleAddItem(event);
        }}
        autoComplete="off"
      >
        <input type="hidden" name="originListId" value={list.id} />
        {/* min-w-0 overrides text input browser css that doesn't allow it to shrink past some point and makes it clip */}
        <input
          ref={clearform}
          className="w-full min-w-0"
          type="text"
          name="newItem"
          minLength="1"
          maxLength="99"
          required
        />
        {/* Without whitespace-nowrap button text folds ?*/}
        <button
          size-="small"
          type="submit"
          className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0 whitespace-nowrap`}
        >
          [Add Item]
        </button>
      </form>

      {/* Settings menu dialog is a part of List*/}
      <ListSettings
        list={list}
        myItems={myItems}
        handleRenameListStages={handleRenameListStages}
        handleResizeListStages={handleResizeListStages}
      />
      {/* TODO: bug on md screen. Sometimes modal can appear not in the center but higher, and can overlap navbar. Don't know when it triggers or why*/}
    </div>
  );
}

function ListSettings({
  list,
  myItems,
  handleResizeListStages,
  handleRenameListStages,
}) {
  return (
    // Each list's dialog is uniquely associated with it by id. Otherwise changing its settings affects all lists
    // Dimensions subject to change
    <dialog
      className={`h-4/5 max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      id={`config-board-dialog-${list.id}`}
      popover="true"
    >
      <article
        className={`dialog-webtuibox-spacing flex h-full flex-col`}
        box-="double"
      >
        {/* tabIndex focuses dialog's header instead of first input which is the default*/}
        <h1 tabIndex="0">Settings/List/{list.name}</h1>
        <section>
          <h2># Stages</h2>

          {/* TODO: accessibility audit? */}
          {/* Display list.stages.length - 1 to user because there's always one, stages[0] aka unspecified, but it's hidden from user and can't be changed */}
          <label htmlFor="listStages">
            <input
              type="range"
              min="0"
              max="7"
              name="listStages"
              value={list.stages.length - 1}
              onChange={(e) =>
                handleResizeListStages(
                  e.target.value,
                  list.stages,
                  list.id,
                  myItems,
                )
              }
              required
            />
            {list.stages.length - 1}
          </label>

          {/* TODO: ugly ass */}
          {/* TODO+: see react.dev Optimizing re-rendering on every keystroke  */}
          <form className={`flex flex-col gap-1`} autoComplete="off">
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 2 ? `${styles.disabled}` : `${styles.stage1}`}`}
              value={list.stages[1] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 1, list.id)
              }
              required
              disabled={list.stages.length < 2}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 3 ? `${styles.disabled}` : `${styles.stage2}`}`}
              value={list.stages[2] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 2, list.id)
              }
              required
              disabled={list.stages.length < 3}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 4 ? `${styles.disabled}` : `${styles.stage3}`}`}
              value={list.stages[3] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 3, list.id)
              }
              required
              disabled={list.stages.length < 4}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 5 ? `${styles.disabled}` : `${styles.stage4}`}`}
              value={list.stages[4] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 4, list.id)
              }
              required
              disabled={list.stages.length < 5}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 6 ? `${styles.disabled}` : `${styles.stage5}`}`}
              value={list.stages[5] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 5, list.id)
              }
              required
              disabled={list.stages.length < 6}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 7 ? `${styles.disabled}` : `${styles.stage6}`}`}
              value={list.stages[6] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 6, list.id)
              }
              required
              disabled={list.stages.length < 7}
            />
            <input
              type="text"
              name="stage"
              minLength="1"
              maxLength="12"
              className={`${list.stages.length < 8 ? `${styles.disabled}` : `${styles.stage7}`}`}
              value={list.stages[7] || ""}
              onChange={(e) =>
                handleRenameListStages(e.target.value, 7, list.id)
              }
              required
              disabled={list.stages.length < 8}
            />
          </form>
        </section>

        <section className="self-center align-bottom">
          <button commandfor={`config-board-dialog-${list.id}`} command="close">
            Exit
          </button>
        </section>
      </article>
    </dialog>
  );
}
