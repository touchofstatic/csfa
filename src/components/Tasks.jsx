import { useState } from "react";
import taskdb from "../taskdb";

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
        autocomplete="off"
      >
        <input
          type="text"
          name="task"
        ></input>
        <button>add</button>
      </form>
      <ul>{taskListItems}</ul>
    </>
  );
}
