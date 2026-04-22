import { useContext, useEffect, useRef } from "react";
import { ManagerContext } from "./Contexts";
import { Howl } from "howler";
import soundfile0 from "../sound0.mp3";
import soundfile1 from "../sound1.mp3";
import soundfileSus from "../sound2.mp3";
// AUDIT: should I move sound files to another folder?
// TODO: add a small selection of fun sounds
// TODO: refactor Pomodoro.jsx to use howler library as well

export default function PomodoroConfig() {
  const { pomoConfig, changePomoConfig, resetPomoConfig } =
    useContext(ManagerContext);

  // Selecting an alarm sound plays a preview
  // 90% of related code is to solve issues like overlapping when user clicks sound B but sound A hasn't finished playing yet and memory leaks
  // New sound effect instances declared directly like "const sound = new Howl({ src: ['sound.mp3'] })" are being created on re-rerender and you lose control of previous instances. Instead we declare them with stable identity
  const previewSoundsRef = useRef(null);
  useEffect(() => {
    previewSoundsRef.current = {
      sound0: new Howl({ src: [soundfile0] }),
      sound1: new Howl({ src: [soundfile1] }),
      suspicious: new Howl({ src: [soundfileSus] }),
    };
    // Cleanup for the audio objects. For each Howl instance .stop immediately halts playback, .unload() releases audio resources from memory. This prevents lingering audio, avoids leaks, and keeps behavior predictable when leaving the config screen
    return () => {
      const sounds = previewSoundsRef.current;
      if (!sounds) return;
      Object.values(sounds).forEach((sound) => {
        sound.stop();
        sound.unload();
      });
      // Clears the ref explicitly by  removing the stored value
      previewSoundsRef.current = null;
    };
  }, []);

  function stopAllPreviews() {
    const sounds = previewSoundsRef.current;
    if (!sounds) return;
    Object.values(sounds).forEach((sound) => {
      sound.stop();
    });
  }

  // Preview for selecting a track. Should interrupt each other (prevent overlap)
  function trackPreview(nextSound) {
    const sounds = previewSoundsRef.current;
    if (!sounds) return;
    stopAllPreviews();
    sounds[nextSound]?.play();
  }

  // Preview for adjusting volume. Should not interrupt each other (drag slider while listening)
  function volumePreview(currentSound) {
    const sounds = previewSoundsRef.current;
    if (!sounds) return;
    if (!sounds[currentSound]?.playing()) sounds[currentSound]?.play();
  }

  // Normalize and clamp a UI volume value into the range expected by audio libraries like Howler, converting a percentage-style input (75) into a decimal gain value (0.75). Values below 0 become 0, and values above 1 become 1. So nextVolume is intended to stay in [0, 1], and it prevents invalid loudness values from being applied to the sound engine
  useEffect(() => {
    const nextVolume = Math.min(
      1,
      Math.max(0, Number(pomoConfig.volume) / 100),
    );
    const sounds = previewSoundsRef.current;
    if (!sounds) return;
    Object.values(sounds).forEach((sound) => {
      sound.volume(nextVolume);
    });
  }, [pomoConfig.volume]);

  return (
    <>
      <button
        size-="small"
        command="show-modal"
        commandfor="config-pomo-dialog"
        className={`block w-full text-left hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        Pomodoro
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="config-pomo-dialog"
        popover="true"
        // Cleanup sound previews
        onClose={stopAllPreviews}
        className={`h-dvh max-h-dvh w-full md:h-[26lh] md:w-[40ch]`}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col`}
          box-="double"
        >
          <h1 tabIndex="0">Config/Pomodoro</h1>
          {/* AUDIT: see react.dev Optimizing re-rendering on every keystroke  */}
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

              <label htmlFor="auto">Auto start:</label>
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
            <form className={`grid grid-cols-2`} autoComplete="off">
              <label htmlFor="alarmsound">Alarm sound:</label>
              <fieldset className="flex flex-col">
                <input
                  type="radio"
                  name="alarmsound"
                  id="sound0"
                  value="sound0"
                  checked={pomoConfig.alarmSound === "sound0"}
                  onChange={(e) => {
                    changePomoConfig(e.target.value, e.target.name);
                    trackPreview(e.target.value);
                  }}
                ></input>
                {/* KNOWN ISSUE: Why are you hidden behind checkbox.... low priority because it's "fixed" */}
                <label htmlFor="sound0" className="ml-[3ch]">
                  sound0
                </label>{" "}
                <input
                  type="radio"
                  name="alarmsound"
                  id="sound1"
                  value="sound1"
                  checked={pomoConfig.alarmSound === "sound1"}
                  onChange={(e) => {
                    changePomoConfig(e.target.value, e.target.name);
                    trackPreview(e.target.value);
                  }}
                ></input>
                <label htmlFor="sound1" className="ml-[3ch]">
                  sound1
                </label>
                <input
                  type="radio"
                  name="alarmsound"
                  id="suspicious"
                  value="suspicious"
                  checked={pomoConfig.alarmSound === "suspicious"}
                  onChange={(e) => {
                    changePomoConfig(e.target.value, e.target.name);
                    trackPreview(e.target.value);
                  }}
                ></input>
                <label htmlFor="suspicious" className="ml-[3ch]">
                  Suspicious
                </label>
              </fieldset>
            </form>

            <label htmlFor="volume">
              Volume:
              <input
                type="range"
                min="0"
                max="100"
                name="volume"
                value={pomoConfig.volume}
                onChange={(e) => {
                  changePomoConfig(e.target.value, e.target.name);
                  volumePreview(pomoConfig.alarmSound);
                }}
                className="w-full min-w-0"
              />
              {pomoConfig.volume}
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
            <button
              commandfor="config-pomo-dialog"
              command="close"
              // Cleanup sound previews
              onClick={stopAllPreviews}
            >
              Exit
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
}
