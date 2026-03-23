import { useContext, useRef } from "react";
import { ManagerContext } from "./Contexts";
import Ascii from "./Ascii";
import Random from "./Random";
import Pomo from "./Pomo.jsx";

export default function Sidebar() {
  const { items, handleAddList } = useContext(ManagerContext);

  return (
    // TODO: mobile broke
    <aside className="flex flex-col md:w-[40ch]">
      <Ascii text="csfa" />
      <NewListForm onAddList={handleAddList} />
      <Random items={items} />
      <Pomo />
    </aside>
  );
}

function NewListForm({ onAddList }) {
  const clearform = useRef("");

  return (
    <form
      onSubmit={onAddList}
      autoComplete="off"
      className="flex flex-col md:flex-row"
    >
      <input
        className="w-full min-w-0"
        type="text"
        name="newList"
        minLength="0"
        maxLength="99"
        ref={clearform}
      ></input>
      <button
        size-="small"
        type="submit"
        className="w-full self-center md:w-[20ch]"
      >
        [Add List]
      </button>
    </form>
  );
}
