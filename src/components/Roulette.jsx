import { useState } from "react";
import taskdb from "../taskdb";

export default function Roulette() {
  const [pull, setPull] = useState(" ");

  function randomize() {
    let randomIndex = Math.floor(Math.random() * taskdb.length);
    console.log(randomIndex);
    setPull(taskdb[randomIndex]);
  }

  return (
    <>
      <button onClick={randomize}>Give task</button>
      <div>yipee</div>
      <div>{pull.name}</div>
    </>
  );
}
