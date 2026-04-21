import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import Import from "./Import";
import Export from "./Export";
import ResetBoardConfig from "./ResetBoardConfig";

export default function BoardConfig() {
  const { stagesConfig, handleResizeConfigStages, handleRenameConfigStages } =
    useContext(ManagerContext);

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
        className={`${stagesConfig.length < i + 1 ? `bg-[var(--background1)] ` : sdcolor}`}
        value={stagesConfig[i] || ""}
        onChange={(e) => handleRenameConfigStages(e.target.value, i)}
        required
        disabled={stagesConfig.length < i + 1}
      />,
    );
  }

  return (
    <>
      <button
        command="show-modal"
        commandfor="config-board-dialog"
        size-="small"
        className={`block w-full text-left hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        Board
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="config-board-dialog"
        popover="true"
        className={`h-dvh max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col`}
          box-="double"
        >
          <h1 tabIndex="0">Config/Board</h1>
          <section>
            <h2># Stages</h2>
            <p>
              Default settings for new lists. Changing it will not overwrite
              existing ones, or disable configuring new lists individually.
            </p>

            {/* AUDIT: accessibility */}
            <label htmlFor="stagesConfig">
              <input
                type="range"
                min="0"
                max="7"
                name="stagesConfig"
                value={stagesConfig.length - 1}
                onChange={(e) => {
                  handleResizeConfigStages(e.target.value);
                }}
                required
              />
              {stagesConfig.length - 1}
            </label>

            <form className={`flex flex-col gap-1`} autoComplete="off">
              {stagesdisplay}
            </form>
          </section>
          <section className="flex w-fit flex-col gap-1">
            <h2># Data</h2>
            <Import />
            <Export />
            <ResetBoardConfig />
          </section>

          {/* KNOWN ISSUE: align bottom doesn't work*/}
          <section className="self-center align-bottom">
            <button commandfor="config-board-dialog" command="close">
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
