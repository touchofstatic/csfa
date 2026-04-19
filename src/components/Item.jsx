import { useState, useContext } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/item.module.css";

export default function Item({ item, myListId, stages, ...handle }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  // Clicking outside ends the rename interaction
  const ref = useClickAway(() => {
    setDraftRenameItem("");
  });

  // TODO: this kinda sucks? very confusing. look at closely later and at least comment more extensively
  // Generate class name used to style Item's elements according to its stage
  let stageClassName = "stage" + item.stage;
  // Name of item's stage to display
  let stage = "";
  // TODO: I don't like that only one is <span> (due to the need to hide the text but have clickable text there)
  switch (stageClassName) {
    case "stage0":
      stage = <span className="invisible">{stages[0]}</span>;
      break;
    case "stage1":
      stage = stages[1];
      break;
    case "stage2":
      stage = stages[2];
      break;
    case "stage3":
      stage = stages[3];
      break;
    case "stage4":
      stage = stages[4];
      break;
    case "stage5":
      stage = stages[5];
      break;
    case "stage6":
      stage = stages[6];
      break;
    case "stage7":
      stage = stages[7];
      break;
    default:
      stage = "ERROR";
      break;
  }

  // AUDIT: not sure if bad or okay. ask later
  let name = "";
  // If not renaming, display name normally
  if (!draftRenameItem) {
    name = (
      <div
        className={`${styles.name} ${styles[stageClassName]} breakword pl-[1ch]`}
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
      className={`${stageClassName} ${styles.item} ${!draftRenameItem && `${styles.hoveritem}`}`}
    >
      {/* Item controls */}
      <div>
        {/* Dnd drag handle */}
        <span
          {...handle}
          className={`${styles[stageClassName]} noselect p-0.5 hover:font-bold`}
        >
          [=]
        </span>
        {/* Rename */}
        <button
          className={`${styles.controls} ${styles[stageClassName]} p-0.5`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        {/* Delete */}
        <button
          className={`${styles.controls} ${styles[stageClassName]} p-0.5`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [-]
        </button>
        {/* Advance stage */}
        <button
          size-="small"
          className={`${styles[stageClassName]} float-right bg-transparent p-0 text-[var(--foreground2)]`}
          onClick={() => handleAdvanceItem(item.id, stages)}
        >
          {stage} [&gt;]
        </button>
      </div>
      {name}
    </div>
  );
}
