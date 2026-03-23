import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import Import from "./Import";
import Export from "./Export";
import Reset from "./Reset";
import styles from "../styles/list.module.css";
import boxpad from "../styles/boxpad.module.css";

export default function SettingsTasks() {
  const { userProgs, handleResizeUserProgs, handleRenameProgs } =
    useContext(ManagerContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="settingstasks-dialog"
        size-="small"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        TasksConfig
      </button>

      <dialog
        id="settingstasks-dialog"
        popover="true"
        className={`h-4/5 max-h-dvh w-full md:h-[25lh]`}
        // open
      >
        <article
          className={`flex h-full flex-col ${boxpad.boxpad}`}
          box-="double"
        >
          <h1>Settings</h1>
          <h2># Tasks</h2>
          <section>
            <h3>## Progress</h3>
            {/* TODO: warning */}
            <form className={`flex flex-col`} autoComplete="off">
              <label>
                Range:
                <input
                  type="number"
                  name="range"
                  min="0"
                  max="7"
                  value={userProgs.length - 1}
                  onChange={(e) => handleResizeUserProgs(e.target.value)}
                  required
                ></input>
              </label>
            </form>

            {/* TODO: maybe you could iterate over it somehow idk */}
            {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
            {/* TODO: either do something about min length or unclickable empty space in progress advance button */}
            <form className={`flex flex-col gap-1`} autoComplete="off">
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress1} disabled:grayscale-70`}
                value={userProgs[1] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 1)}
                required
                disabled={userProgs.length < 2}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress2} disabled:grayscale-70`}
                value={userProgs[2] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 2)}
                required
                disabled={userProgs.length < 3}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress3} disabled:grayscale-70`}
                value={userProgs[3] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 3)}
                required
                disabled={userProgs.length < 4}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress4} disabled:grayscale-70`}
                value={userProgs[4] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 4)}
                required
                disabled={userProgs.length < 5}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress5} disabled:grayscale-70`}
                value={userProgs[5] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 5)}
                required
                disabled={userProgs.length < 6}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress6} disabled:grayscale-70`}
                value={userProgs[6] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 6)}
                required
                disabled={userProgs.length < 7}
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={`${styles.progress7} disabled:grayscale-70`}
                value={userProgs[7] || ""}
                onChange={(e) => handleRenameProgs(e.target.value, 7)}
                required
                disabled={userProgs.length < 8}
              />
            </form>
          </section>
          <section className="flex w-fit flex-col gap-1">
            <h3>## Data</h3>
            <Import />
            <Export />
            <Reset />
          </section>

          {/* TODO: align bottom doesnt work */}
          <section className="self-center align-bottom">
            <button commandfor="settingstasks-dialog" command="close">
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
