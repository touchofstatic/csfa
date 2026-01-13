import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Roulette from "./Roulette.jsx";

function Task({ task, onDelete, onSave, advProg }) {
  const [draft, setDraft] = useState("");
  let progClassName = "prog-" + task.progress;
  // not editing
  if (!draft) {
    return (
      <>
        <span className="task-controls">
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
            e
          </button>
          <button
            size-="small"
            onClick={() => advProg(task.id)}
          >
            &gt;
          </button>
        </span>
        {/* <input
          className={progClassName}
          value={task.name}
          readOnly
          
        ></input> */}
        <span className={progClassName}>{task.name}</span>
        <span> {task.progress}</span>
      </>
    );
  }

  // editing
  else {
    return (
      <>
        <span className="task-controls">
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
            s
          </button>
          <button size-="small">&gt;</button>
        </span>
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
        />
        <span> {task.progress}</span>
      </>
    );
    // not editing
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
    setTasks([...tasks, { name: newTask, progress: 0, id: uuidv4() }]);
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

  function handleAdvProg(id) {
    setTasks(
      tasks.map((task) => {
        if (id !== task.id) return task;
        else {
          if (task.progress == 6) return { ...task, progress: 0 };
          else return { ...task, progress: task.progress + 1 };
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
              advProg={() => handleAdvProg(task.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
