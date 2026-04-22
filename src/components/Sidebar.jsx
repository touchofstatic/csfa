import { useContext, useRef } from "react";
import { ManagerContext } from "./Contexts";
import Ascii from "./Ascii";
import RandomItem from "./RandomItem";
import Pomodoro from "./Pomodoro.jsx";

// md: sticky sidebar
// sm: column. NOT FINAL LAYOUT! NOT CHANGING THIS SOON!
export default function Sidebar() {
  const { items, handleAddList } = useContext(ManagerContext);

  return (
    <aside className="flex flex-col md:sticky md:top-[2lh] md:h-full md:w-[36ch] md:min-w-[36ch] md:self-start md:overflow-y-auto">
      <Ascii text="csfa" />
      <NewListForm onAddList={handleAddList} />
      <RandomItem items={items} />
      <Pomodoro />
    </aside>
  );
}

function NewListForm({ onAddList }) {
  // Ref to clear form text after submit
  const clearform = useRef("");

  return (
    <form
      onSubmit={onAddList}
      autoComplete="off"
      className="mb-[1lh] flex flex-col md:flex-row"
    >
      {/* min-w-0 overrides text input browser css that doesn't allow it to shrink past some point and makes it clip */}
      <input
        className="w-full min-w-0"
        type="text"
        name="newList"
        minLength="0"
        maxLength="99"
        ref={clearform}
      ></input>
      <button size-="small" type="submit" className="w-full md:w-[18ch]">
        [Add List]
      </button>
    </form>
  );
}
