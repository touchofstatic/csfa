//TODO: TEMPORARY !!!!!! PORTED FROM POMO. MERGE
import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import styles from "../styles/navbar.module.css";
import idk from "../styles/idk.module.css";

export default function SettingsPomo() {
  const { config, changeConfig, resetConfig } = useContext(ManagerContext);

  return (
    <>
      <button
        size-="small"
        command="show-modal"
        commandfor="settingspomo-dialog"
        // TODO: PORTED FROM POMO. WE DON'T DO THESE ANYMORE. DELETE CSS MODULE
        className={styles.navbutton}
      >
        SettingsPomo
      </button>

      {/* TODO: this shit is so ass */}
      <dialog
        id="settingspomo-dialog"
        popover="true"
        className={`h-4/5 w-full md:h-[50ch]`}
      >
        <article
          className={`align-center flex h-full flex-col justify-center ${idk.article}`}
          box-="double"
        >
          {/* TODO: see react.dev Optimizing re-rendering on every keystroke  */}
          <h2>Timer</h2>
          <form className={`flex flex-col`} autoComplete="off">
            <label>
              Pomodoro:
              <input
                type="number"
                name="pomo"
                min="0"
                max="59"
                value={config.pomo / 60}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
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
                value={config.short / 60}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
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
                value={config.long / 60}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
                required
              ></input>
            </label>
            <label>
              Interval:
              <input
                type="number"
                name="interval"
                min="1"
                value={config.interval}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
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
                checked={config.autoStart === false}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
                // defaultChecked={config.autoStart === false}
              ></input>
              <label htmlFor="autoFalse">No</label>
              <input
                type="radio"
                name="auto"
                id="autoTrue"
                value="yes"
                checked={config.autoStart === true}
                onChange={(e) => changeConfig(e.target.value, e.target.name)}
                // defaultChecked={config.autoStart === true}
              ></input>
              <label htmlFor="autoTrue">Yes</label>
            </label>
          </form>
          <h2>Sound</h2>
          <label htmlFor="volume">
            Volume
            <input
              type="range"
              min="0"
              max="100"
              name="volume"
              value={config.volume}
              onChange={(e) => {
                changeConfig(e.target.value, e.target.name);
              }}
            />
            {config.volume}
          </label>
          <h2>Data</h2>
          {/* TODO: prompt warning dialog? */}
          <button
            type="button"
            size-="small"
            className="w-fit"
            onClick={resetConfig}
          >
            Reset settings
          </button>
          <div className="flex justify-center">
            <button commandfor="settingspomo-dialog" command="close">
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
