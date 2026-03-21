import { useState, useEffect, useRef } from "react";
import { useTimer } from "react-timer-hook";
import Clock from "./Clock";
import useSound from "use-sound";
// TODO: is import better?
// TODO: balance volume in audacity!!! too high
// TODO: move to another folder? is it better?
// import melokacool_notification_6 from "../src/melokacool_notification_6.mp3";
const SOUND_URL = "../src/melokacool_notification_6.mp3";

import { AsciiProgressBar } from "@yacosta738/ascii-progress-bar/browser";
AsciiProgressBar.register();

// TODO: read some design guidelines and ponder width
customElements.whenDefined("ascii-progress-bar").then(() => {
  AsciiProgressBar.addPattern("braille-long", {
    empty: "⣀",
    filled: "⣿",
    length: 15,
  });
});

// TODO: temporary
let total = 0;

export default function Pomo({ config }) {
  const [mode, setMode] = useState(["Pomodoro", config.pomo]);
  // for auto start; don't auto start if timer was rendered due to page loading or user changing mode
  const [ongoing, setOngoing] = useState(false);
  const [pomocount, setPomocount] = useState(0);

  const [play] = useSound(SOUND_URL, {
    volume: config.volume,
  });

  // TODO: OOOOOOOOOOOOOO
  if (mode[0] === "Pomodoro" && mode[1] !== config.pomo)
    setMode(["Pomodoro", config.pomo]);
  if (mode[0] === "Short break" && mode[1] !== config.short)
    setMode(["Short break", config.short]);
  if (mode[0] === "Long break" && mode[1] !== config.long)
    setMode(["Long break", config.long]);

  function handleExpire() {
    if (mode[0] === "Pomodoro") {
      setPomocount(pomocount + 1);
      if ((pomocount + 1) % config.interval !== 0)
        setMode(["Short break", config.short]);
      else setMode(["Long break", config.long]);
    } else if (mode[0] === "Short break" || mode[0] === "Long break") {
      setMode(["Pomodoro", config.pomo]);
    }
    play();
  }

  // TODO: OOOOOO?
  function selectMode(mode) {
    if (mode === "Pomodoro") {
      setMode(["Pomodoro", config.pomo]);
      setOngoing(false);
    }
    if (mode === "Short break") {
      setMode(["Short break", config.short]);
      setOngoing(false);
    }
    if (mode === "Long break") {
      setMode(["Long break", config.long]);
      setOngoing(false);
    }
  }

  return (
    <article
      className={`flex max-w-full flex-col items-center md:w-[50ch]`}
      box-="square"
    >
      <section className={`flex flex-col py-[1lh]`}>
        <button
          type="button"
          size-="small"
          className={`${mode[0] === "Pomodoro" ? `font-bold text-[var(--background0)]` : `cursor-pointer bg-transparent text-[var(--foreground0)]`}`}
          onClick={() => {
            selectMode("Pomodoro");
          }}
        >
          Pomodoro
        </button>
        <button
          size-="small"
          className={`${mode[0] === "Short break" ? `font-bold text-[var(--background0)]` : `cursor-pointer bg-transparent text-[var(--foreground0)]`}`}
          onClick={() => {
            selectMode("Short break");
          }}
        >
          Short break
        </button>
        <button
          size-="small"
          className={`${mode[0] === "Long break" ? `font-bold text-[var(--background0)]` : `cursor-pointer bg-transparent text-[var(--foreground0)]`}`}
          onClick={() => {
            selectMode("Long break");
          }}
        >
          Long break
        </button>

        <Timer
          autoStart={config.autoStart}
          onExpire={handleExpire}
          mode={mode}
          key={mode}
          ongoing={ongoing}
          startOngoing={() => setOngoing(true)}
        />
        <p>Pomodoros: {pomocount}</p>
      </section>
    </article>
  );
}

function Timer({ autoStart, onExpire, mode, ongoing, startOngoing }) {
  const [paused, setPaused] = useState(false);
  const bar = useRef();

  const time = new Date();
  // duration of this mode from config in seconds
  time.setSeconds(time.getSeconds() + mode[1]);

  let auto = false;
  if (ongoing === true && autoStart === true) auto = true;

  const timer = useTimer({
    expiryTimestamp: time,
    autoStart: auto,
    onExpire: () => {
      // effect can't proc at 00:01 > 00:00
      if (mode[0] === "Pomodoro") total++;
      onExpire();
    },
  });

  useEffect(() => {
    if (
      mode[0] === "Pomodoro" &&
      timer.minutes !== mode[1] / 60 &&
      timer.minutes !== mode[1] / 60 - 1
    ) {
      total++;
    }
    // TODO: return??
  }, [timer.minutes, mode]);

  // TODO: possibly not cool in react and many many rerender
  useEffect(() => {
    bar.current.setAttribute(
      "progress",
      Math.floor(
        ((mode[1] - (timer.minutes * 60 + timer.seconds)) * 100) / mode[1],
      ),
    );
  }, [timer.minutes, timer.seconds, mode]);

  return (
    <section>
      <Clock minutes={timer.minutes} seconds={timer.seconds} />
      {/* TODO: align */}
      <ascii-progress-bar
        pattern="braille-long"
        show-progress="true"
        ref={bar}
      ></ascii-progress-bar>

      <div>
        {!timer.isRunning && paused === false && (
          <button
            onClick={() => {
              timer.start();
              startOngoing();
            }}
          >
            Start
          </button>
        )}
        {timer.isRunning && (
          <button
            onClick={() => {
              setPaused(true);
              timer.pause();
            }}
          >
            Pause
          </button>
        )}
        {paused === true && (
          <button
            onClick={() => {
              setPaused(false);
              timer.resume();
            }}
          >
            Resume
          </button>
        )}
      </div>
      <div>Total: {total} minutes</div>
    </section>
  );
}
