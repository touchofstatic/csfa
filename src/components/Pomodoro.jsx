import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { ManagerContext } from "./Contexts";
import { useTimer } from "react-timer-hook";
import { AsciiProgressBar } from "@yacosta738/ascii-progress-bar/browser";
import useSound from "use-sound";
import Clock from "./Clock";

const TOTAL_WINS_KEY = "total-wins";
const TOTAL_TIME_KEY = "total-time";

function getTodayStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readDailyState(key) {
  const raw = localStorage.getItem(key);
  const today = getTodayStamp();

  if (!raw) {
    // No record > reset
    return { date: today, value: 0 };
  }

  try {
    const parsed = JSON.parse(raw);
    // Educational concept from chat: backward compatibility with old numeric-only records i.e From when my app recorded { total-time: n }.
    // "This check is a migration safeguard. It handles older localStorage data that may have been saved as a plain number before the app switched to the newer object format { date, value }. When parsed is a number, the code wraps it into the new structure and assigns today’s date. That lets the app keep existing user data instead of discarding it, while ensuring the rest of the code always receives one consistent shape. In practice, this avoids breaking changes during upgrades and keeps the daily-reset logic compatible with legacy stored values"
    if (typeof parsed === "number") {
      return { date: today, value: parsed };
    }

    // Check structure
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.date === "string" &&
      typeof parsed.value === "number"
    ) {
      // Parse success, correct structure > check for daily reset
      return parsed.date === today ? parsed : { date: today, value: 0 };
    }
    // Remember: catch only runs on thrown errors, mainly invalid JSON syntax
  } catch {
    // Parse failure > reset
    return { date: today, value: 0 };
  }
  // Parse success, incorrect stucture > reset
  return { date: today, value: 0 };
}

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

// TODO+++: Save daily history records when migrating to DB
export default function Pomodoro() {
  const { pomoConfig } = useContext(ManagerContext);
  // Current mode = its name and duration
  const [mode, setMode] = useState(["Pomodoro", pomoConfig.pomo]);
  // For auto start. Only AS during mode cycle (pomo > short > pomo > long > ...), don't AS if Timer rendered due to page loading or manually selecting mode. That'd be bad user experience. Note: cycling and paused are different and entirely unrelated
  const [cycling, setCycling] = useState(false);
  // Daily counters are stored with {date, value} so they reset automatically when a new day starts.
  const [totalWinsRecord, setTotalWinsRecord] = useState(() =>
    readDailyState(TOTAL_WINS_KEY),
  );
  const [totalTimeRecord, setTotalTimeRecord] = useState(() =>
    readDailyState(TOTAL_TIME_KEY),
  );

  const totalWins = totalWinsRecord.value;
  const totalTime = totalTimeRecord.value;

  // Update localstorage
  useEffect(() => {
    const today = getTodayStamp();
    const recordToSave =
      totalWinsRecord.date === today
        ? totalWinsRecord
        : { date: today, value: 0 };

    localStorage.setItem(TOTAL_WINS_KEY, JSON.stringify(recordToSave));
  }, [totalWinsRecord]);

  useEffect(() => {
    const today = getTodayStamp();
    const recordToSave =
      totalTimeRecord.date === today
        ? totalTimeRecord
        : { date: today, value: 0 };

    localStorage.setItem(TOTAL_TIME_KEY, JSON.stringify(recordToSave));
  }, [totalTimeRecord]);

  // Initialize alarm sound
  const [play] = useSound(`../src/assets/audio/${pomoConfig.alarmSound}.mp3`, {
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
      const today = getTodayStamp();
      const currentWins =
        totalWinsRecord.date === today ? totalWinsRecord.value : 0;
      const nextWins = currentWins + 1;

      setTotalWinsRecord({ date: today, value: nextWins });
      // Don't forget, set state is asyncronous!
      if (nextWins % pomoConfig.interval !== 0)
        setMode(["Short break", pomoConfig.short]);
      else setMode(["Long break", pomoConfig.long]);
    } else if (mode[0] === "Short break" || mode[0] === "Long break") {
      setMode(["Pomodoro", pomoConfig.pomo]);
    }
    // Alarm sound c:
    play();
  }

  // Cache addMinute with useCallback so that it doesn't cause a loop in effect. Because it uses the functional updater and doesn't reference total time directly, it doesn't have dependencies itself
  const addMinute = useCallback(() => {
    setTotalTimeRecord((prev) => {
      const today = getTodayStamp();
      const baseValue = prev.date === today ? prev.value : 0;
      return { date: today, value: baseValue + 1 };
    });
  }, []);

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
          onAddMinute={addMinute}
        />
      </section>
      {/* Statistics */}
      <p>Completed: {totalWins}</p>
      <p>
        Time: {Math.floor(totalTime / 60)} hr {totalTime % 60} min
      </p>
    </article>
  );
}

function Timer({
  autoStart,
  onExpire,
  mode,
  cycling,
  startOngoing,
  onAddMinute,
}) {
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
      if (mode[0] === "Pomodoro") onAddMinute();
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
  // 2) I also tried useStopwatch from react-timer-hook. But it can't pause, and always risks going out of sync with useTimer. Ultimately, calculating from the timer info we already have is perfectly fine.
  useEffect(() => {
    if (
      mode[0] === "Pomodoro" &&
      timer.minutes !== mode[1] / 60 &&
      timer.minutes !== mode[1] / 60 - 1
    ) {
      onAddMinute();
    }
  }, [timer.minutes, mode, onAddMinute]);

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
