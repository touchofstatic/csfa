import { useState } from "react";
import taskdb from "../taskdb";
import Roulette from "./Roulette.jsx";

let newKey = taskdb.length;

export default function Tasks() {
  const [tasks, setTasks] = useState(taskdb);
  const taskListItems = tasks.map((task) => <li key={task.id}>{task.name}</li>);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = formData.get("task");
    setTasks([...tasks, { id: newKey++, name: newTask }]);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          type="text"
          name="task"
        ></input>
        <button>add</button>
      </form>
      <ul>{taskListItems}</ul>
      <Roulette tasks={tasks} />
    </>
  );
}
