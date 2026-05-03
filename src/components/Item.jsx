import { useState, useContext } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/item.module.css";

export default function Item({ item, myListId, stages, ...handle }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const [menu, setMenu] = useState(false);

  const {
    handleDeleteItem,
    handleRenameItem,
    handleResetItem,
    handleAdvanceItem,
  } = useContext(ManagerContext);

  // Clicking outside ends the rename interaction
  const ref = useClickAway(() => {
    setDraftRenameItem("");
  });

  // Generate class names to style Item's elements according to its stage
  let ctrlcolor = "front-stage" + item.stage;
  let contentcolor = "bg-stage" + item.stage;

  // AUDIT: not sure if bad or okay. ask later
  let name = "";
  // If not renaming, display name normally
  if (!draftRenameItem) {
    name = (
      <div className={`${contentcolor} breakword pl-[1ch]`}>{item.name}</div>
    );
    // If renaming, display the form in its place
  } else {
    name = (
      <form
        ref={ref}
        onSubmit={(event) => {
          handleRenameItem(event);
          setDraftRenameItem("");
        }}
        autoComplete="off"
      >
        <input type="hidden" name="itemId" value={item.id} />
        <input
          type="text"
          name="newItemName"
          className="w-full"
          defaultValue={draftRenameItem}
          autoFocus
          required
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
              setDraftRenameItem("");
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
      className={`${styles.item} ${!draftRenameItem && `${styles.hoveritem}`} py-0.5`}
    >
      {/* Item controls */}
      <div className={`py-0.5`}>
        {/* Dnd drag handle. Needs noselect, and set font-bold individually as it's not a button like the others */}
        <span
          {...handle}
          className={`${ctrlcolor} noselect px-0.5 hover:font-bold`}
        >
          [=]
        </span>
        {/* Toggle menu */}
        {/* <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => setMenu(!menu)}
        >
          [⋯]
        </button> */}
        {/* Rename */}
        <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [r]
        </button>
        {/* Delete */}
        <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [d]
        </button>
        {/* Reset stage */}
        <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => handleResetItem(item.id)}
        >
          [c]
        </button>

        {/* Advance stage */}
        <button
          size-="small"
          className={`${ctrlcolor} float-right bg-transparent p-0 text-[var(--foreground2)]`}
          onClick={() => handleAdvanceItem(item.id, stages)}
        >
          <span className={`${item.stage === 0 && `invisible`}`}>
            {stages[item.stage]}&nbsp;
          </span>
          [&gt;]
        </button>
      </div>
      {name}

      {/* {menu === true && (
        <div className="absolute z-10 flex w-[16ch] flex-col bg-[var(--background0)]">
          <p>Rename</p>
          <p>Delete</p>
          <p>Clear</p>
        </div>
      )} */}
    </div>
  );
}
