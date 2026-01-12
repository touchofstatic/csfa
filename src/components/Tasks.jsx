import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Roulette from "./Roulette.jsx";

function Task({ task, onDelete, onSave }) {
  const [draft, setDraft] = useState("");

  // editing
  if (draft) {
    return (
      <label>
        <button
          size-="small"
          onClick={() => onDelete(task.id)}
        >
          -
        </button>

        <button
          size-="small"
          onClick={() => {
            onSave({ ...task, name: draft });
            setDraft("");
          }}
        >
          save
        </button>
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
        />
        <div is-="separator"></div>
      </label>
    );
    // not editing
  } else {
    return (
      <label>
        <button
          size-="small"
          onClick={() => onDelete(task.id)}
        >
          -
        </button>
        <button
          size-="small"
          onClick={() => {
            setDraft(task.name);
          }}
        >
          edit
        </button>
        {task.name}
        <div is-="separator"></div>
      </label>
    );
  }
}

export default function Tasks() {
  // load localstorage
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

  function handleSave(e) {
    setTasks(
      tasks.map((task) => {
        if (e.id !== task.id) return task;
        else {
          return e;
        }
      })
    );
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
            <Task
              task={task}
              onDelete={() => handleDelete(task.id)}
              onSave={handleSave}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
