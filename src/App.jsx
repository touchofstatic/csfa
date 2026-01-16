// import { useState, useEffect } from "react";
// import Clock from "./components/Clock.jsx";
import Timer from "./components/Timer.jsx";
import Tasks from "./components/Tasks.jsx";
import Roulette from "./components/Roulette.jsx";
import Test from "./components/Test.jsx";
import Test2 from "./components/Test2.jsx";

// TODO: move to clock???
// function useTime() {
//   const [time, setTime] = useState(() => new Date());

//   useEffect(() => {
//     const id = setInterval(() => {
//       setTime(new Date());
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);
//   return time;
// }

export default function App() {
  // const clock = useTime();

  return (
    <main>
      {/* <Clock clock={clock.toLocaleTimeString("en-GB")} /> */}
      {/* <Timer /> */}
      {/* TODO: separate roulette and tasks? */}
      {/* <Tasks /> */}
      <Test2 />
    </main>
  );
}
