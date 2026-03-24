import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import boxpad from "../styles/boxpad.module.css";

export default function SettingsPomo() {
  const { userPomo, changePomoConfig, resetPomoConfig } =
    useContext(ManagerContext);

  return (
    <>
      <button
        size-="small"
        command="show-modal"
        commandfor="settingspomo-dialog"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        PomoConfig
      </button>

      {/* TODO: this shit is so ass */}
      <dialog
        id="settingspomo-dialog"
        popover="true"
        className={`h-dvh max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      >
        <article
          className={`flex h-full flex-col ${boxpad.boxpad}`}
          box-="double"
        >
          <h1 tabindex="0">Settings/Pomodoro</h1>
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
                value={userPomo.pomo / 60}
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
                value={userPomo.short / 60}
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
                value={userPomo.long / 60}
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
                value={userPomo.interval}
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
                  checked={userPomo.autoStart === false}
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
                  checked={userPomo.autoStart === true}
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
                value={userPomo.volume}
                onChange={(e) => {
                  changePomoConfig(e.target.value, e.target.name);
                }}
              />
              {userPomo.volume}
            </label>
          </section>

          <section>
            <h2># Data</h2>
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
            <button commandfor="settingspomo-dialog" command="close">
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
