import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import Import from "./Import";
import Export from "./Export";
import Reset from "./Reset";
import styles from "../styles/list.module.css";
import boxpad from "../styles/boxpad.module.css";

export default function SettingsTasks() {
  const { userProgs, handleRenameUserProgs } = useContext(ManagerContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="settingstasks-dialog"
        size-="small"
        className={`active:bg-[var(--color1)]`}
      >
        TasksConfig
      </button>

      <dialog
        id="settingstasks-dialog"
        popover="true"
        className={`h-4/5 max-h-dvh w-full md:h-[25lh]`}
      >
        <article
          className={`flex h-full flex-col ${boxpad.boxpad}`}
          box-="double"
        >
          <h1>Settings</h1>
          <h2># Tasks</h2>

          <section>
            {/* <h4>## Progress</h4> */}
            {/* TODO: maybe you could iterate over it somehow idk */}
            {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
            {/* TODO: either do something about min length or unclickable empty space in progress advance button. should I allow empty progs idk */}
            <form className={`flex flex-col gap-1`} autoComplete="off">
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress1}
                value={userProgs[1]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 1)}
                required
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress2}
                value={userProgs[2]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 2)}
                required
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress3}
                value={userProgs[3]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 3)}
                required
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress4}
                value={userProgs[4]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 4)}
                required
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress5}
                value={userProgs[5]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 5)}
                required
              />
              <input
                type="text"
                name="progress"
                minLength="1"
                maxLength="12"
                className={styles.progress6}
                value={userProgs[6]}
                onChange={(e) => handleRenameUserProgs(e.target.value, 6)}
                required
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
