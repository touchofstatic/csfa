import { useState, useContext } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/item.module.css";

export default function Item({ item, myListId, progs, ...handle }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  // Clicking outside ends the rename interaction
  const ref = useClickAway(() => {
    setDraftRenameItem("");
  });

  // TODO: this kinda sucks? very confusing. look at closely later and at least comment more extensively
  // Generate class name used to style Item's elements according to its progress
  let progressClassName = "progress" + item.progress;
  // Name of item's progress to display
  let progress = "";
  // TODO: I don't like that only one is <span> (due to the need to hide the text but have clickable text there)
  switch (progressClassName) {
    case "progress0":
      progress = <span className="invisible">{progs[0]}</span>;
      break;
    case "progress1":
      progress = progs[1];
      break;
    case "progress2":
      progress = progs[2];
      break;
    case "progress3":
      progress = progs[3];
      break;
    case "progress4":
      progress = progs[4];
      break;
    case "progress5":
      progress = progs[5];
      break;
    case "progress6":
      progress = progs[6];
      break;
    case "progress7":
      progress = progs[7];
      break;
    default:
      progress = "ERROR";
      break;
  }

  // TODO: not sure if bad or okay. ask later
  let name = "";
  // If not renaming, display name normally
  if (!draftRenameItem) {
    name = (
      <div
        className={`${styles.name} ${styles[progressClassName]} breakword pl-[1ch]`}
      >
        {item.name}
      </div>
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
      className={`${progressClassName} ${styles.item} ${!draftRenameItem && `${styles.hoveritem}`}`}
    >
      {/* Item controls */}
      <div>
        {/* Dnd drag handle */}
        <span
          {...handle}
          className={`${styles[progressClassName]} noselect p-0.5 hover:font-bold`}
        >
          [=]
        </span>
        {/* Rename */}
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0.5`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        {/* Delete */}
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0.5`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [-]
        </button>
        {/* Advance progress */}
        <button
          size-="small"
          className={`${styles[progressClassName]} float-right bg-transparent p-0 text-[var(--foreground2)]`}
          onClick={() => handleAdvanceItem(item.id, progs)}
        >
          {progress} [&gt;]
        </button>
      </div>
      {name}
    </div>
  );
}
