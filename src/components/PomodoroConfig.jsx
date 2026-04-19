import { useContext } from "react";
import { ManagerContext } from "./Contexts";

export default function PomodoroConfig() {
  const { pomoConfig, changePomoConfig, resetPomoConfig } =
    useContext(ManagerContext);

  return (
    <>
      <button
        size-="small"
        command="show-modal"
        commandfor="config-pomo-dialog"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        PomoConfig
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="config-pomo-dialog"
        popover="true"
        className={`h-dvh max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col`}
          box-="double"
        >
          <h1 tabIndex="0">Settings/Pomodoro</h1>
          {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
          <section>
            <h2># Timer</h2>
            <form className={`grid grid-cols-2`} autoComplete="off">
              <label htmlFor="pomo">Pomodoro:</label>
              <input
                type="number"
                name="pomo"
                min="0"
                max="59"
                className="w-[8ch] min-w-0"
                value={pomoConfig.pomo / 60}
                onChange={(e) =>
                  changePomoConfig(e.target.value, e.target.name)
                }
                required
              ></input>
              <label htmlFor="short">Short break:</label>
              <input
                type="number"
                name="short"
                min="0"
                max="59"
                className="w-[8ch] min-w-0"
                value={pomoConfig.short / 60}
                onChange={(e) =>
                  changePomoConfig(e.target.value, e.target.name)
                }
                required
              ></input>
              <label htmlFor="long">Long break:</label>

              <input
                type="number"
                name="long"
                min="0"
                max="59"
                className="w-[8ch] min-w-0"
                value={pomoConfig.long / 60}
                onChange={(e) =>
                  changePomoConfig(e.target.value, e.target.name)
                }
                required
              ></input>
              <label htmlFor="interval">Interval:</label>
              <input
                type="number"
                name="interval"
                min="1"
                className="w-[8ch] min-w-0"
                value={pomoConfig.interval}
                onChange={(e) =>
                  changePomoConfig(e.target.value, e.target.name)
                }
                required
              ></input>
              <label htmlFor="auto">Auto start</label>
              <fieldset>
                <input
                  type="radio"
                  name="auto"
                  id="autoFalse"
                  value="no"
                  checked={pomoConfig.autoStart === false}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                ></input>
                <label htmlFor="autoFalse">No</label>
                <input
                  type="radio"
                  name="auto"
                  id="autoTrue"
                  value="yes"
                  checked={pomoConfig.autoStart === true}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                ></input>
                <label htmlFor="autoTrue">Yes</label>
              </fieldset>
            </form>
          </section>

          <section>
            <h2># Sound</h2>
            <label htmlFor="volume">
              Volume
              <input
                type="range"
                min="0"
                max="100"
                name="volume"
                value={pomoConfig.volume}
                onChange={(e) => {
                  changePomoConfig(e.target.value, e.target.name);
                }}
              />
              {pomoConfig.volume}
            </label>
            {/* TOOO: add a selection of cool alarm sounds */}
          </section>

          <section>
            <h2># Data</h2>
            {/* TODO: warning dialog to match board? */}
            <button
              type="button"
              size-="small"
              className="w-fit"
              onClick={resetPomoConfig}
            >
              Reset settings
            </button>
          </section>
          <section className="self-center align-bottom">
            <button commandfor="config-pomo-dialog" command="close">
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
