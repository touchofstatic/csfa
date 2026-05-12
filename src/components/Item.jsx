import { useState, useContext } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/item.module.css";

export default function Item({
  item,
  myListId,
  stageNames,
  activeStageCount,
  ...handle
}) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  // Unused dropdown menu code
  // I still can't say if items should have drop down menus or not... I ran into some issues with implementing click away. The controls bar is very short anyway, and is probably used often, compared to lists'. Drop down menu seems more mobile-friendly but mobile version is currently on hold because I suspect some things will have to be completely different and I'm not educated enough to do it yet, and I'm more interested in desktop. These days nothing should be desktop only though.
  // const [menu, setMenu] = useState(false);

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

  // Unused dropdown menu code
  // Clicking outside closes the menu
  // const refMenu = useClickAway(() => {
  //   setMenu(false);
  // });

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
          minLength="0"
          maxLength="99"
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
        {/* Unused dropdown menu code */}
        {/* Toggle menu */}
        {/* <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => setMenu(!menu)}
        >
          [⋯]
        </button> */}
        <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [r]
        </button>
        <button
          className={`${ctrlcolor} ${styles.controls} px-0.5`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [d]
        </button>
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
          onClick={() => handleAdvanceItem(item.id, activeStageCount)}
        >
          <span className={`${item.stage === 0 && `invisible`}`}>
            {stageNames[item.stage]}&nbsp;
          </span>
          [&gt;]
        </button>
      </div>
      {name}

      {/* Unused dropdown menu code */}
      {/* {menu === true && (
        <div className="absolute z-10 flex w-[16ch] flex-col bg-[var(--background0)]">
          <button
            className={`block text-left`}
            size-="small"
            onClick={() => {
              setDraftRenameItem(item.name);
              setMenu(false);
            }}
          >
            Rename
          </button>
          <button
            className={`block text-left`}
            size-="small"
            onClick={() => {
              handleDeleteItem(item.id, myListId);
              setMenu(false);
            }}
          >
            Delete
          </button>
        </div>
      )} */}
    </div>
  );
}
