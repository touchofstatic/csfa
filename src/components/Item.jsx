import { useState, useContext } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { ManagerContext } from "./Contexts";
import styles from "../styles/item.module.css";

export default function Item({ item, myListId, status, ...handle }) {
  const [draftRenameItem, setDraftRenameItem] = useState("");
  const { handleDeleteItem, handleRenameItem, handleAdvanceItem } =
    useContext(ManagerContext);

  const ref = useClickAway(() => {
    setDraftRenameItem("");
  });

  let progressClassName = "progress" + item.progress;
  let progress = "";

  switch (progressClassName) {
    case "progress0":
      progress = <span className="invisible">{status[0]}</span>;
      break;
    case "progress1":
      progress = status[1];
      break;
    case "progress2":
      progress = status[2];
      break;
    case "progress3":
      progress = status[3];
      break;
    case "progress4":
      progress = status[4];
      break;
    case "progress5":
      progress = status[5];
      break;
    case "progress6":
      progress = status[6];
      break;
    default:
      progress = "???";
      break;
  }

  // TODO: bad?
  let title = "";
  if (!draftRenameItem) {
    title = (
      <div className={`${styles.name} ${styles[progressClassName]} pl-[1ch]`}>
        {item.name}
      </div>
    );
  } else {
    title = (
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
          <button className="w-full" size-="small" type="submit">
            [Save]
          </button>
          <button
            type="button"
            className="w-full"
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
      <div>
        {/* TODO: find a good place and style for it */}
        <span {...handle} className={`${styles[progressClassName]} noselect`}>
          [=]
        </span>
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0`}
          size-="small"
          onClick={() => setDraftRenameItem(item.name)}
        >
          [rn]
        </button>
        <button
          className={`${styles.controls} ${styles[progressClassName]} p-0`}
          size-="small"
          onClick={() => handleDeleteItem(item.id, myListId)}
        >
          [-]
        </button>
        <button
          size-="small"
          className={`${styles[progressClassName]} float-right bg-transparent p-0 text-[var(--foreground2)]`}
          onClick={() => handleAdvanceItem(item.id)}
        >
          {progress} [&gt;]
        </button>
      </div>
      {title}
    </div>
  );
}
