import { useState, useContext, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/list.module.css";
import boxpad from "../styles/boxpad.module.css";
import Item from "./Item";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function List({ list, index, children }) {
  const [draftRenameList, setDraftRenameList] = useState("");
  const ref = useClickAway(() => {
    setDraftRenameList("");
  });

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

  const clearform = useRef("");

  const myItems = list.itemIds
    .map((key) => items.find((item) => item.id === key))
    .filter(Boolean);

  // TODO: bad?
  let title = "";
  if (!draftRenameList) {
    title = <div className={`${styles.name}`}>{list.name}</div>;
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
    <div
      className={`flex h-fit flex-col p-[1ch] ${!list.visible ? `${styles.collapsed} border-2 border-[var(--background1)] hover:border-[var(--background3)]` : "border-2 border-[var(--background2)] hover:border-[var(--foreground1)]"}`}
    >
      <header className={`${!list.visible ? `${styles.collapsed}` : ""}`}>
        {title}
        {/* TODO: CONSIDER BUTTONS PLACEMENT */}
        <div>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            command="show-modal"
            commandfor={`settingsboard-dialog-${list.id}`}
          >
            [s]
          </button>

          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => setDraftRenameList(list.name)}
          >
            [rn]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleDeleteList(list.id, myItems)}
          >
            [-]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleCollapseList(list.id)}
          >
            {list.visible ? `[▼]` : `[▲]`}
          </button>

          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "up")}
          >
            [↑]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleMoveList(index, "down")}
          >
            [↓]
          </button>
          <button
            className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0.5`}
            size-="small"
            onClick={() => handleGroupList(list.id, myItems)}
          >
            [g]
          </button>

          {/* TODO: kinda wide lol */}
          {/* <span> | {myItems.length} items</span> */}

          {/* TODO: hhhhhhhh */}
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
        className={`${styles.separator} ${!list.visible ? `${styles.collapsed}` : ""}`}
      ></hr>

      <Droppable key={list.id} droppableId={`${index}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${snapshot.isDraggingOver ? `${styles.over}` : ``}`}
          >
            {myItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    key={item.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    // used to be here before handle
                    // {...provided.dragHandleProps}
                  >
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
        <input
          ref={clearform}
          className="w-full min-w-0"
          type="text"
          name="newItem"
          minLength="1"
          maxLength="99"
          required
        />
        <button
          size-="small"
          type="submit"
          className={`${styles.controls} ${!list.visible ? `${styles.collapsed}` : ""} p-0 whitespace-nowrap`}
        >
          [Add Item]
        </button>
      </form>

      <dialog
        className={`h-4/5 max-h-dvh w-full md:h-[25lh]`}
        id={`settingsboard-dialog-${list.id}`}
        popover="true"
      >
        <article
          className={`flex h-full flex-col ${boxpad.boxpad}`}
          box-="double"
        >
          <h1>Settings/{list.name}</h1>
          <section>
            <h2># Progress</h2>

            {/* <form className={`flex flex-col`} autoComplete="off">
              <label>
                Range:
                <input
                  type="number"
                  name="range"
                  min="0"
                  max="7"
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
                ></input>
              </label>
            </form> */}

            {/* TODO: aria label? */}
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

            {/* TODO: maybe you could iterate over it somehow idk */}
            {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
            {/* TODO: either do something about min length or unclickable empty space in progress advance button. */}
            <form className={`flex flex-col gap-1`} autoComplete="off">
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress1} disabled:grayscale-70`}
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
                className={`${styles.progress2} disabled:grayscale-70`}
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
                className={`${styles.progress3} disabled:grayscale-70`}
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
                className={`${styles.progress4} disabled:grayscale-70`}
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
                className={`${styles.progress5} disabled:grayscale-70`}
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
                className={`${styles.progress6} disabled:grayscale-70`}
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
                className={`${styles.progress7} disabled:grayscale-70`}
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
    </div>
  );
}
