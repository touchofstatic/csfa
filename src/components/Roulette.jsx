import { useState } from "react";

export default function Roulette({ tasks }) {
  const [pull, setPull] = useState("");

  function randomize() {
    if (tasks.length > 0) {
      let randomIndex = Math.floor(Math.random() * tasks.length);
      setPull(tasks[randomIndex]);
    }
  }

  return (
    <>
      <button onClick={randomize}>roulette</button>
      <span className="test">{pull.name}</span>
    </>
  );
}
