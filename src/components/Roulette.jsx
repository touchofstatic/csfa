import { useState } from "react";

export default function Roulette({ tasks }) {
  const [pull, setPull] = useState("");

  function randomize() {
    let randomIndex = Math.floor(Math.random() * tasks.length);
    setPull(tasks[randomIndex]);
  }

  return (
    <>
      <button onClick={randomize}>task gacha</button>
      {/* <span is-="spinner"></span> */}
      <span
        box-="square"
        className="test"
      >
        {pull.name}
      </span>
    </>
  );
}
