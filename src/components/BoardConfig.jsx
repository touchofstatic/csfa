import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import Import from "./Import";
import Export from "./Export";
import ResetBoardConfig from "./ResetBoardConfig";
import styles from "../styles/list.module.css";

export default function BoardConfig() {
  const { stagesConfig, handleResizeConfigStages, handleRenameConfigStages } =
    useContext(ManagerContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="config-board-dialog"
        size-="small"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        BoardConfig
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
          <h1 tabIndex="0">Settings/Board</h1>
          <section>
            <h2># Stages</h2>
            <p>
              Default settings for new lists. Changing it will not overwrite
              existing ones, or disable configuring new lists individually.
            </p>

            {/* TODO: accessibility audit */}
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

            {/* TODO: ugly ass */}
            {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
            {/* TODO: either do something about min length or unclickable empty space in stage advance button */}
            <form className={`flex flex-col gap-1`} autoComplete="off">
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 2 ? `${styles.disabled}` : `${styles.stage1}`}`}
                value={stagesConfig[1] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 1)}
                required
                disabled={stagesConfig.length < 2}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 3 ? `${styles.disabled}` : `${styles.stage2}`}`}
                value={stagesConfig[2] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 2)}
                required
                disabled={stagesConfig.length < 3}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 4 ? `${styles.disabled}` : `${styles.stage3}`}`}
                value={stagesConfig[3] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 3)}
                required
                disabled={stagesConfig.length < 4}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 5 ? `${styles.disabled}` : `${styles.stage4}`}`}
                value={stagesConfig[4] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 4)}
                required
                disabled={stagesConfig.length < 5}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 6 ? `${styles.disabled}` : `${styles.stage5}`}`}
                value={stagesConfig[5] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 5)}
                required
                disabled={stagesConfig.length < 6}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 7 ? `${styles.disabled}` : `${styles.stage6}`}`}
                value={stagesConfig[6] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 6)}
                required
                disabled={stagesConfig.length < 7}
              />
              <input
                type="text"
                name="stage"
                minLength="1"
                maxLength="12"
                className={`${stagesConfig.length < 8 ? `${styles.disabled}` : `${styles.stage7}`}`}
                value={stagesConfig[7] || ""}
                onChange={(e) => handleRenameConfigStages(e.target.value, 7)}
                required
                disabled={stagesConfig.length < 8}
              />
            </form>
          </section>
          <section className="flex w-fit flex-col gap-1">
            <h2># Data</h2>
            <Import />
            <Export />
            <ResetBoardConfig />
          </section>

          {/* TODO: fix align bottom doesn't work*/}
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
