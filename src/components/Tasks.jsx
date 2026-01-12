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

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = formData.get("task");
    setTasks([...tasks, { id: uuidv4(), name: newTask }]);
  }

  function handleDelete(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleEdit(id) {
    const newTasks = tasks.map((task) => {
      if (id !== task.id) return task;
      else {
        return { ...task, name: "edited" };
      }
    });
    setTasks(newTasks);
  }

  return (
    <>
      <Roulette tasks={tasks} />

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          type="text"
          name="task"
          required
        ></input>
        <button size-="small">add</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              size-="small"
              onClick={() => handleDelete(task.id)}
            >
              -
            </button>
            <button
              size-="small"
              onClick={() => handleEdit(task.id)}
            >
              e
            </button>
            {task.name}
            <div is-="separator"></div>
          </li>
        ))}
      </ul>
    </>
  );
}
