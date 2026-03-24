import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import { DragDropContext } from "@hello-pangea/dnd";
import List from "./List";

export default function Board() {
  const { lists, onDragEnd } = useContext(ManagerContext);

  return (
    // important!! alignment doesn't work otherwise!!!
    <article className="or flex w-full max-w-dvw flex-col">
      <div className="grid gap-[0.5ch] sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))]">
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
    </article>
  );
}
