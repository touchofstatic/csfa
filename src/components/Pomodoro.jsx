import { useState, useEffect, useRef } from "react";
import { useTimer } from "react-timer-hook";
import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import Clock from "./Clock";
import useSound from "use-sound";
// TODO+: balance volume in audacity!!! NOT READY TO SHIP!
// AUDIT: is import better? move to another folder? maybe?
// import melokacool_notification_6 from "../src/melokacool_notification_6.mp3";
const SOUND_URL = "../src/melokacool_notification_6.mp3";
import { AsciiProgressBar } from "@yacosta738/ascii-progress-bar/browser";

// @yacosta738/ascii-progress-bar syntax
// Both are cool I cannot decide
AsciiProgressBar.register();
customElements.whenDefined("ascii-progress-bar").then(() => {
  AsciiProgressBar.addPattern("alt178", {
    empty: "░",
    filled: "▓",
    length: 18,
  });
});

customElements.whenDefined("ascii-progress-bar").then(() => {
  AsciiProgressBar.addPattern("braille-long", {
    empty: "⣀",
    filled: "⣿",
    length: 18,
  });
});

// TODO+: temporary, should be saved
// Total minutes spent today (WIP)
let totalMins = 0;

export default function Pomodoro() {
  const { pomoConfig } = useContext(ManagerContext);
  // Current mode = its name and duration
  const [mode, setMode] = useState(["Pomodoro", pomoConfig.pomo]);
  // For auto start. Only AS during mode cycle (pomo > short > pomo > long > ...), don't AS if Timer rendered due to page loading or manually selecting mode. That'd be bad user experience. Note: cycling and paused are different and entirely unrelated
  const [cycling, setCycling] = useState(false);
  // TODO+: store record's date and check against today's date instead of always counting up
  // Total completed pomodoros today (WIP). Based on timer expire proc
  const [pomoWins, setPomoWins] = useState(() => {
    const loadPomoWins = JSON.parse(localStorage.getItem("pomoWins"));
    return loadPomoWins || 0;
  });

  // Update localstorage
  useEffect(() => {
    localStorage.setItem("pomoWins", JSON.stringify(pomoWins));
  }, [pomoWins]);

  // Initialize alarm sound
  const [play] = useSound(SOUND_URL, {
    volume: pomoConfig.volume,
  });

  // IMPORTANT: Enables intended behavior. A check of consistency between mode's duration in here and in config prop
  if (mode[0] === "Pomodoro" && mode[1] !== pomoConfig.pomo)
    setMode(["Pomodoro", pomoConfig.pomo]);
  if (mode[0] === "Short break" && mode[1] !== pomoConfig.short)
    setMode(["Short break", pomoConfig.short]);
  if (mode[0] === "Long break" && mode[1] !== pomoConfig.long)
    setMode(["Long break", pomoConfig.long]);

  // Timer expired
  function handleExpire() {
    if (mode[0] === "Pomodoro") {
      setPomoWins(pomoWins + 1);
      // Don't forget, set state is asyncronous!
      if ((pomoWins + 1) % pomoConfig.interval !== 0)
        setMode(["Short break", pomoConfig.short]);
      else setMode(["Long break", pomoConfig.long]);
    } else if (mode[0] === "Short break" || mode[0] === "Long break") {
      setMode(["Pomodoro", pomoConfig.pomo]);
    }
    // Alarm sound
    play();
  }

  // Select mode
  function selectMode(mode) {
    if (mode === "Pomodoro") {
      setMode(["Pomodoro", pomoConfig.pomo]);
      // Block auto start
      setCycling(false);
    }
    if (mode === "Short break") {
      setMode(["Short break", pomoConfig.short]);
      setCycling(false);
    }
    if (mode === "Long break") {
      setMode(["Long break", pomoConfig.long]);
      setCycling(false);
    }
  }

  return (
    <article className={`flex max-w-full flex-col`}>
      <section className={`flex flex-col`}>
        {/* Mode cycle display & select mode. Current mode is strongly highlighted in foreground */}
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

        {/* IMPORTANT: load-bearing key. Enables intended behavior: Timer rerenders reset with current mode's duration if mode changed OR its duration was changed (in settings). This has to do with how React distinguishes elements in DOM and rerenders when props change.
        mode - key is NOT props. We still need to pass mode to access it
        handleExpire - has lots of logic outside Timer. onExpire is a native function of react-timer-hook
        cycling, startOngoing - set in both Pomodoro and Timer
        */}
        <Timer
          key={mode}
          mode={mode}
          autoStart={pomoConfig.autoStart}
          onExpire={handleExpire}
          cycling={cycling}
          startOngoing={() => setCycling(true)}
        />
      </section>
      {/* Statistics */}
      <p>Completed: {pomoWins}</p>
      <p>
        Time: {Math.floor(totalMins / 60)} hr {totalMins % 60} min
      </p>
    </article>
  );
}

function Timer({ autoStart, onExpire, mode, cycling, startOngoing }) {
  // To conditionally render start/resume/pause
  const [paused, setPaused] = useState(false);
  // Ref to control attribute of progress bar
  const bar = useRef();

  const time = new Date();
  // Convert mode's duration to seconds
  time.setSeconds(time.getSeconds() + mode[1]);

  // Even if autoStart is enabled, auto is initially false and set to true if Timer wasn't rendered from user opening the page or selecting mode
  let auto = false;
  if (autoStart === true && cycling === true) auto = true;

  // react-timer-hook syntax
  const timer = useTimer({
    expiryTimestamp: time,
    autoStart: auto,
    onExpire: () => {
      // False negative no effect proc at 00:01 > 00:00. Add one manually
      if (mode[0] === "Pomodoro") totalMins++;
      onExpire();
    },
  });

  // Record total pomodoro time. Precision in minutes (losing seconds is okay)
  // Explanation:
  // Adds ++ minute when a minute of pomodoro passes. This is easiest by tracking value of timer.minutes.
  // timer.minutes !== mode[1] / 60 : false positive effect proc when Timer renders
  // timer.minutes !== mode[1] / 60 - 1 : 25:00 > 24:59 > false positive effect proc
  // Notes:
  // 1) "That's a lot of effect procs and storage operations. Why not add minutes all at once when a pomodoro stops (by timer expire or select mode)?"
  // User can stop it by other means like closing the browser or turning off the computer. What if user spent 30 minutes out of 45 working and had a power outage? We must add 30 minutes to their statistic. Then we must've been persistently recording that 30 minutes passed. Tracking in real time is the only solution.
  // 2) I also tried useStopwatch from react-timer-hook, but it can't pause, and always risks going out of sync with useTimer. Ultimately, calculating from the timer info we already have is perfectly fine.
  useEffect(() => {
    if (
      mode[0] === "Pomodoro" &&
      timer.minutes !== mode[1] / 60 &&
      timer.minutes !== mode[1] / 60 - 1
    ) {
      totalMins++;
    }
    // TODO: return doko??? DON'T FORGET
  }, [timer.minutes, mode]);

  // Progress bar logic
  useEffect(() => {
    // If mode's timer is 0 minutes, avoid dividing by 0 and display full bar
    if (mode[1] === 0) {
      bar.current.setAttribute("progress", 100);
    } else
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
      <ascii-progress-bar
        pattern="braille-long"
        show-progress="true"
        ref={bar}
        className="text-center"
      ></ascii-progress-bar>

      <div className="flex justify-center">
        {/* Not running but wasn't paused > Wasn't started > Start */}
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
        {/* Running > Pause */}
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
        {/* Paused > Resume */}
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
    </section>
  );
}
