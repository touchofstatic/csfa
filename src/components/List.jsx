import { useState, useContext, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/list.module.css";
import boxpad from "../styles/boxpad.module.css";
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
    handleGroupList,
    handleMoveList,
    handleResizeListProgs,
    handleRenameListProgs,
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
    title = <div className={`${styles.name}`}>{list.name}</div>;
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
    // + Collapsed list styles
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
            commandfor={`settingsboard-dialog-${list.id}`}
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
          {/* Group by progress */}
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleGroupList(list.id, myItems)}
          >
            [g]
          </button>
        </div>
      </header>

      <hr
        className={`${styles.separator} ${!list.visible ? `${styles.collapsed}` : ""}`}
      ></hr>

      {/* IMPORTANT: don't touch dnd logic or it will explode. Nested divs here are for specific needs of @hello-pangea/dnd library. There's barely any relevant code examples on the internet and the documentation is painful and still uses React class components so just be thankful that it works. */}
      <Droppable key={list.id} droppableId={`${index}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // TODO: at the time of commenting I'm not sure that css module class exists anymore? look later
            className={`${snapshot.isDraggingOver ? `${styles.over}` : ``}`}
          >
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
                        progs={list.progs}
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
        handleRenameListProgs={handleRenameListProgs}
        handleResizeListProgs={handleResizeListProgs}
      />
      {/* TODO: bug on md screen. Sometimes modal can appear not in the center but higher, and can overlap navbar. Don't know when or why*/}
    </div>
  );
}

function ListSettings({
  list,
  myItems,
  handleResizeListProgs,
  handleRenameListProgs,
}) {
  return (
    // TODO: dimensions subject to change
    // Each list's dialog has to be uniquely associated with it, otherwise changing its settings affects all lists
    <dialog
      className={`h-4/5 max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      id={`settingsboard-dialog-${list.id}`}
      popover="true"
    >
      <article
        className={`flex h-full flex-col ${boxpad.boxpad}`}
        box-="double"
      >
        {/* tabIndex focuses dialog's header instead of first input which is the default*/}
        <h1 tabIndex="0">Settings/{list.name}</h1>
        <section>
          <h2># Progress</h2>

          {/* TODO: accessibility audit? */}
          {/* Displays list.progs.length - 1 to user because there's always one, progs[0] aka unspecified, but it's hidden from user and can't be changed */}
          <label htmlFor="listProgs">
            <input
              type="range"
              min="0"
              max="7"
              name="listProgs"
              value={list.progs.length - 1}
              onChange={(e) =>
                handleResizeListProgs(
                  e.target.value,
                  list.progs,
                  list.id,
                  myItems,
                )
              }
              required
            />
            {list.progs.length - 1}
          </label>

          {/* TODO: maybe you could iterate over this somehow idk */}
          {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
          <form className={`flex flex-col gap-1`} autoComplete="off">
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 2 ? `${styles.disabled}` : `${styles.progress1}`}`}
              value={list.progs[1] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 1, list.id)
              }
              required
              disabled={list.progs.length < 2}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 3 ? `${styles.disabled}` : `${styles.progress2}`}`}
              value={list.progs[2] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 2, list.id)
              }
              required
              disabled={list.progs.length < 3}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 4 ? `${styles.disabled}` : `${styles.progress3}`}`}
              value={list.progs[3] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 3, list.id)
              }
              required
              disabled={list.progs.length < 4}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 5 ? `${styles.disabled}` : `${styles.progress4}`}`}
              value={list.progs[4] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 4, list.id)
              }
              required
              disabled={list.progs.length < 5}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 6 ? `${styles.disabled}` : `${styles.progress5}`}`}
              value={list.progs[5] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 5, list.id)
              }
              required
              disabled={list.progs.length < 6}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 7 ? `${styles.disabled}` : `${styles.progress6}`}`}
              value={list.progs[6] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 6, list.id)
              }
              required
              disabled={list.progs.length < 7}
            />
            <input
              type="text"
              name="progress"
              minLength="1"
              maxLength="12"
              className={`${list.progs.length < 8 ? `${styles.disabled}` : `${styles.progress7}`}`}
              value={list.progs[7] || ""}
              onChange={(e) =>
                handleRenameListProgs(e.target.value, 7, list.id)
              }
              required
              disabled={list.progs.length < 8}
            />
          </form>
        </section>

        <section className="self-center align-bottom">
          <button
            commandfor={`settingsboard-dialog-${list.id}`}
            command="close"
          >
            Exit
          </button>
        </section>
      </article>
    </dialog>
  );
}
