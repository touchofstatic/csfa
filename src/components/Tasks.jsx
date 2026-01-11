import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Roulette from "./Roulette.jsx";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const loadTaskDb = JSON.parse(localStorage.getItem("taskdb"));
    return loadTaskDb || [];
  });

  // update localstorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskdb", JSON.stringify(tasks));
  }, [tasks]);

  const taskListItems = tasks.map((task) => <li key={task.id}>{task.name}</li>);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = formData.get("task");
    setTasks([...tasks, { id: uuidv4(), name: newTask }]);
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
