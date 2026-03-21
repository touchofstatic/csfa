import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import styles from "../styles/list.module.css";
import idk from "../styles/idk.module.css";

export default function Settings() {
  const { userProgs, handleRenameUserProgs, handleResetUserProgs } =
    useContext(ManagerContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="settings-dialog"
        size-="small"
        className={`active:bg-[var(--color1)]`}
      >
        Settings
      </button>

      <dialog
        id="settings-dialog"
        popover="true"
        className={`h-4/5 w-full md:h-[44ch] md:w-[38ch]`}
      >
        <article className={`flex h-full flex-col ${idk.idk}`} box-="double">
          <h2>Settings</h2>
          <section className={`h-full md:w-[20ch]`}>
            <h3># Progress</h3>
            {/* TODO: maybe you could iterate over it somehow idk */}
            {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
            {/* TODO: either do something about min length or unclickable empty space in progress advance button. should I allow empty progs idk */}
            <form className={`flex flex-col`} autoComplete="off">
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
          {/* TODO: warning dialog */}
          <section className="h-full">
            <h3># Data</h3>
            <button
              type="button"
              size-="small"
              className="w-fit"
              onClick={handleResetUserProgs}
            >
              Reset
            </button>
          </section>

          <section className="self-center align-bottom">
            <button commandfor="settings-dialog" command="close">
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
