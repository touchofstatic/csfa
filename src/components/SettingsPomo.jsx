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
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--color1)]`}
      >
        PomoConfig
      </button>

      {/* TODO: this shit is so ass */}
      <dialog
        id="settingspomo-dialog"
        popover="true"
        className={`h-4/5 max-h-dvh w-full md:h-[25lh]`}
      >
        <article
          className={`flex h-full flex-col ${boxpad.boxpad}`}
          box-="double"
        >
          <h1>Settings</h1>
          {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
          <h2># Pomodoro</h2>
          <section>
            <h3>## Timer</h3>
            <form className={`flex flex-col`} autoComplete="off">
              <label>
                Pomodoro:
                <input
                  type="number"
                  name="pomo"
                  min="0"
                  max="59"
                  value={userPomo.pomo / 60}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                  required
                ></input>
              </label>
              <label>
                Short break:
                <input
                  type="number"
                  name="short"
                  min="0"
                  max="59"
                  value={userPomo.short / 60}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                  required
                ></input>
              </label>
              <label>
                Long break:
                <input
                  type="number"
                  name="long"
                  min="0"
                  max="59"
                  value={userPomo.long / 60}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                  required
                ></input>
              </label>
              <label>
                Interval:
                <input
                  type="number"
                  name="interval"
                  min="1"
                  value={userPomo.interval}
                  onChange={(e) =>
                    changePomoConfig(e.target.value, e.target.name)
                  }
                  required
                ></input>
              </label>
              <label>
                Auto start
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
              </label>
            </form>
          </section>

          <section>
            <h3>## Sound</h3>
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
            <h3>## Data</h3>
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
