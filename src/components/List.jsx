import { useState, useContext, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ManagerContext } from "./Contexts";
import Item from "./Item";
import styles from "../styles/list.module.css";

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

  // AUDIT: not sure if bad or okay. ask later
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
      className={`flex h-fit flex-col p-[1ch] ${list.collapsed ? `${styles.collapsed} border-2 border-[var(--background1)] hover:border-[var(--background3)]` : "border-2 border-[var(--background2)] hover:border-[var(--foreground1)]"}`}
    >
      <header className={`${list.collapsed ? `${styles.collapsed}` : ""}`}>
        {title}
        <Bar myItems={myItems} />

        {/* List controls */}
        <div>
          {/* Settings */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            command="show-modal"
            commandfor={`config-board-dialog-${list.id}`}
          >
            [s]
          </button>
          {/* Rename */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            [rn]
          </button>
          {/* Delete */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
          >
            [-]
          </button>
          {/* Collapse */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => handleCollapseList(list.id)}
          >
            {list.collapsed ? `[▼]` : `[▲]`}
          </button>
          {/* Move up */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "up")}
          >
            [↑]
          </button>
          {/* Move down */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "down")}
          >
            [↓]
          </button>
          {/* Order by stage */}
          <button
            className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
            size-="small"
            onClick={() => handleOrderList(list.id, myItems)}
          >
            [o]
          </button>
        </div>
      </header>

      <hr
        className={`${styles.separator} ${list.collapsed ? `${styles.collapsed}` : ""}`}
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
                    {!list.collapsed && (
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
          className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} p-0 whitespace-nowrap`}
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
      {/* KNOWN ISSUE: on md screen, sometimes modal can appear not in the center but higher, and can overlap navbar. Don't know when it triggers or why. High priority*/}
    </div>
  );
}

function ListSettings({
  list,
  myItems,
  handleResizeListStages,
  handleRenameListStages,
}) {
  const stagesdisplay = [];
  for (let i = 1; i < 8; i++) {
    const sdcolor = "bg-stage" + i;
    stagesdisplay.push(
      // AUDIT: see react.dev Optimizing re-rendering on every keystroke
      <input
        key={sdcolor}
        type="text"
        name="stage"
        minLength="1"
        maxLength="12"
        className={`${list.stages.length < i + 1 ? `bg-[var(--background1)] ` : sdcolor}`}
        value={list.stages[i] || ""}
        onChange={(e) => handleRenameListStages(e.target.value, i, list.id)}
        required
        disabled={list.stages.length < i + 1}
      />,
    );
  }

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
        <h1 tabIndex="0">Config/List/{list.name}</h1>
        <section>
          <h2># Stages</h2>

          {/* AUDIT: accessibility */}
          {/* Display list.stages.length - 1 to user because there's always one, stages[0] aka none, but it's hidden from user and can't be changed */}
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

          <form className={`flex flex-col gap-1`} autoComplete="off">
            {stagesdisplay}
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

// Stacked bar graph of items' stages (That's what this style of graph is called)
// NOTES from removed filter implementation: click on segment to display only items at corresponding stage. Click anywhere on bar to reset. Stage 0 segment can't be targeted, can only reset filter.
// I added "filter" state that was -1 or index. handleFilter if arg !== -1 then setFilter -1, else setFilter(arg). Pass filter to Item to conditionally display if filter === -1 or .item.stage. opacity-15 is good.
// HOWEVER user experience issue: user filters targeting stage i items A, ... > changes stage of A (which is the primary mode of using the site) > A isn't in filter anymore and disappears but user probably still wants to interact with A. We might want to "capture" filtered items in the moment and keep them onscreen. So it'd be based on "items that passed filter" rather than "current condition of stage". Does that contradict the concept of filtering?
function Bar({ myItems }) {
  // Collect items by stage to know how many in each
  let segments = [[], [], [], [], [], [], [], []];
  myItems.map((item) => {
    segments[item.stage].push(item.id);
  });

  const bar = [];
  let segcolor = "";

  for (let i = 1; i < 8; i++) {
    segcolor = "bg-stage" + i;
    if (segments[i].length > 0)
      bar.push(
        // Segment occupies width based on its items count % of all items. Shouldn't squish each other to become unreadable
        <span
          key={i}
          className={`${segcolor} min-w-fit px-[1ch]`}
          style={{ width: `${(segments[i].length * 100) / myItems.length}%` }}
        >
          {segments[i].length}
        </span>,
      );
  }
  // none goes last
  segcolor = "bg-stage0";
  if (segments[0].length > 0)
    bar.push(
      <span
        key="0"
        className={`${segcolor} min-w-fit px-[1ch]`}
        style={{ width: `${(segments[0].length * 100) / myItems.length}%` }}
      >
        {segments[0].length}
      </span>,
    );
  // It's important to set bar width
  return <div className="noselect flex w-full min-w-full py-0.5">{bar}</div>;
}
