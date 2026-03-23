import { useContext, useRef } from "react";
import { ManagerContext } from "./Contexts";
import { DragDropContext } from "@hello-pangea/dnd";
import List from "./List";
import Ascii from "./Ascii";
import Random from "./Random";

export default function Board() {
  const { items, lists, handleAddList, onDragEnd } = useContext(ManagerContext);

  return (
    <div className="grid gap-[1ch] sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))]">
      <aside className="flex flex-col">
        <Ascii text="csfa" />
        <Random items={items} />
        <NewListForm onAddList={handleAddList} />
      </aside>

      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, index) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </DragDropContext>

      {/* List auto-fit control placeholders because I'm a shameful being */}
      {/* TODO: HIDE ACCESSIBLY */}
      {lists.length <= 2 && (
        <div className="hidden md:invisible md:block">lmao</div>
      )}
      {lists.length === 1 && (
        <div className="hidden md:invisible md:block">lmao</div>
      )}
    </div>
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
        className="w-full self-center md:w-[21ch]"
      >
        [Add List]
      </button>
    </form>
  );
}
