import { useState, useEffect } from "react";
import Clock from "./components/Clock.jsx";
import Timer from "./components/Timer.jsx";
import Tasks from "./components/Tasks.jsx";
import Roulette from "./components/Roulette.jsx";

function useTime() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();

  return (
    <>
      <Clock time={time.toLocaleTimeString("en-GB")} />
      <Timer />
      {/* TODO: separate roulette and tasks? */}
      <Tasks />
    </>
  );
}
