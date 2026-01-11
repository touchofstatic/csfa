import { useState } from "react";

export default function Roulette({ tasks }) {
  const [pull, setPull] = useState(" ");

  function randomize() {
    let randomIndex = Math.floor(Math.random() * tasks.length);
    console.log(randomIndex);
    setPull(tasks[randomIndex]);
  }

  return (
    <>
      <button onClick={randomize}>Give task</button>
      <div>{pull.name}</div>
    </>
  );
}
