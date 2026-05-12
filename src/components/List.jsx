import { useState, useContext, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ManagerContext } from "./Contexts";
import Item from "./Item";
import styles from "../styles/list.module.css";

export default function List({ list, index, children }) {
  const [draftRenameList, setDraftRenameList] = useState("");
  const [menu, setMenu] = useState(false);
  const {
    items,
    handleAddItem,
    handleDeleteList,
    handleRenameList,
    handleCollapseList,
    handleOrderList,
    handleMoveList,
    handleApplyListStagesSettings,
  } = useContext(ManagerContext);

  // Clicking outside ends the rename interaction
  const ref = useClickAway(() => {
    setDraftRenameList("");
  });

  // Clicking outside closes the menu
  const refMenu = useClickAway(() => {
    setMenu(false);
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
      <div className={`${styles.name} clear-left font-[700] break-all`}>
        {list.name}
      </div>
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
        {/* Menu. Not visible when renaming but I didn't combine it with renaming logic for no reason I didn't want to lock in that day idk. Clicking outside closes menu and clicking a button in menu does too */}
        {!draftRenameList && (
          <div className="relative float-right" ref={refMenu}>
            <button
              className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
              size-="small"
              onClick={() => {
                handleCollapseList(list.id);
                setMenu(false);
              }}
            >
              {list.collapsed ? `[▼]` : `[▲]`}
            </button>
            {/* Move up */}
            <button
              className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
              size-="small"
              onClick={() => {
                handleMoveList(index, "up");
                setMenu(false);
              }}
            >
              [↑]
            </button>
            {/* Move down */}
            <button
              className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
              size-="small"
              onClick={() => {
                handleMoveList(index, "down");
                setMenu(false);
              }}
            >
              [↓]
            </button>

            {/* Toggle menu */}
            <button
              className={`${styles.controls} ${list.collapsed ? `${styles.collapsed}` : ""} px-0.5`}
              size-="small"
              onClick={() => setMenu(!menu)}
            >
              [⋯]
            </button>

            {menu === true && (
              <div className="absolute right-0 z-10 flex w-[16ch] flex-col bg-[var(--background0)]">
                <button
                  className={`block text-left`}
                  size-="small"
                  // Note: previously used command show-modal but was changed by proposed edits and I kept it because it worked smoothly with setMenu(false). I always struggle to combine approaches of native command show-modal and onClick for closing menus in this app
                  // Consider: direct DOM lookup here is said to be more brittle than refs
                  onClick={() => {
                    const dialog = document.getElementById(
                      `config-board-dialog-${list.id}`,
                    );
                    if (dialog) dialog.showPopover();
                    setMenu(false);
                  }}
                >
                  Settings
                </button>
                {/* Rename */}
                <button
                  className={`block text-left`}
                  size-="small"
                  onClick={() => {
                    setDraftRenameList(list.name);
                    setMenu(false);
                  }}
                >
                  Rename
                </button>
                {/* Delete */}
                <button
                  className={`block text-left`}
                  size-="small"
                  onClick={() => {
                    handleDeleteList(list.id, myItems);
                    setMenu(false);
                  }}
                >
                  Delete
                </button>
                {/* Order by stage */}
                <button
                  className={`block text-left`}
                  size-="small"
                  onClick={() => {
                    handleOrderList(list.id, myItems);
                    setMenu(false);
                  }}
                >
                  Order
                </button>
              </div>
            )}
          </div>
        )}

        {title}
        <Bar myItems={myItems} />
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
                        stageNames={list.stageNames}
                        activeStageCount={list.activeStageCount}
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
        className={`flex gap-[1ch]`}
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
          [Add task]
        </button>
      </form>

      {/* Settings menu dialog is a part of List*/}
      <ListSettings
        list={list}
        myItems={myItems}
        handleApplyListStagesSettings={handleApplyListStagesSettings}
      />
      {/* KNOWN ISSUE: on md screen, sometimes modal can appear not in the center but higher, and can overlap navbar. Don't know when it triggers or why. High priority*/}
    </div>
  );
}

// COPILOT CODE: EXAMINE 3
function ListSettings({ list, myItems, handleApplyListStagesSettings }) {
  // TODO: I don't know if I agree with this const and function being scattered across the app. Also appears in Manager
  const MAX_COLORED_STAGES = 7;

  function padStageNames(source = []) {
    const next = Array(MAX_COLORED_STAGES + 1).fill("");
    next[0] = "none";
    for (let i = 1; i <= MAX_COLORED_STAGES; i++) {
      next[i] = source[i] || "";
    }
    return next;
  }

  const [draftActiveStageCount, setDraftActiveStageCount] = useState(
    list.activeStageCount,
  );
  const [draftStageNames, setDraftStageNames] = useState(
    padStageNames(list.stageNames),
  );

  const savedStageNames = padStageNames(list.stageNames);
  const isDirty =
    draftActiveStageCount !== list.activeStageCount ||
    savedStageNames.some((name, index) => name !== draftStageNames[index]);

  function resetDraft() {
    setDraftActiveStageCount(list.activeStageCount);
    setDraftStageNames(savedStageNames);
  }

  const stagesdisplay = [];
  for (let i = 1; i <= MAX_COLORED_STAGES; i++) {
    const sdcolor = "bg-stage" + i;
    const isActive = i <= draftActiveStageCount;
    stagesdisplay.push(
      <input
        key={sdcolor}
        type="text"
        name={`stage-${i}`}
        minLength="1"
        maxLength="12"
        className={`${isActive ? sdcolor : "bg-[var(--background1)] text-[var(--foreground1)]"} w-[20ch]`}
        value={draftStageNames[i] || ""}
        onChange={(e) => {
          const next = [...draftStageNames];
          next[i] = e.target.value;
          setDraftStageNames(next);
        }}
        required={isActive}
      />,
    );
  }

  return (
    // Each list's dialog is uniquely associated with it by id. Otherwise changing its settings affects all lists
    // Dimensions subject to change
    <dialog
      className={`max-h-dvh w-full md:w-[50ch]`}
      id={`config-board-dialog-${list.id}`}
      popover="true"
      // runs when dialog toggles and detects open transition to reinitialize draft state from canonical values. prevents stale edits from leaking back
      onToggle={(event) => {
        if (event.currentTarget.matches(":popover-open")) resetDraft();
      }}
    >
      <article
        className={`dialog-webtuibox-spacing flex h-full flex-col gap-[1lh]`}
        box-="double"
      >
        {/* tabIndex focuses dialog's header instead of first input which is the default*/}
        <h1 tabIndex="0" className="break-all">
          Settings/{list.name}
        </h1>
        <section>
          <h2># Stages</h2>
          {/* Explicit stepper reduces accidental destructive changes */}
          <div className="flex items-center gap-[1ch]">
            <button
              type="button"
              onClick={() =>
                setDraftActiveStageCount(Math.max(0, draftActiveStageCount - 1))
              }
            >
              [-]
            </button>
            <span className="min-w-[2ch] text-center">
              {draftActiveStageCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setDraftActiveStageCount(
                  Math.min(MAX_COLORED_STAGES, draftActiveStageCount + 1),
                )
              }
            >
              [+]
            </button>
          </div>

          <form
            className={`flex flex-col gap-1`}
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              handleApplyListStagesSettings(
                list.id,
                draftActiveStageCount,
                draftStageNames,
                myItems,
              );
              event.currentTarget.closest("dialog")?.hidePopover();
            }}
          >
            {stagesdisplay}
            <div className="flex gap-[1ch]">
              <button type="submit" disabled={!isDirty}>
                Save
              </button>
              <button
                type="button"
                onClick={(event) => {
                  resetDraft();
                  event.currentTarget.closest("dialog")?.hidePopover();
                }}
              >
                Exit
              </button>
            </div>
          </form>
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
