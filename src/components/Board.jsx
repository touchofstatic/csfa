import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import { DragDropContext } from "@hello-pangea/dnd";
import List from "./List";

export default function Board() {
  const { lists, onDragEnd } = useContext(ManagerContext);

  return (
    // IMPORTANT: alignment doesn't work without this for some reason
    <article className="flex w-full max-w-dvw flex-col">
      <div className="grid gap-[0.5ch] sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))]">
        {/* a list is destination of dnd */}
        <DragDropContext onDragEnd={onDragEnd}>
          {lists.map((list, index) => (
            <List key={list.id} list={list} index={index} />
          ))}
        </DragDropContext>
        {/* (md screen) Invisible fake grid items in case there's only 1 or 2 lists to create the grid spacing I want. I tried auto-fill but I didn't like how when list resizes with the page it stutters badly */}
        {/* TODO: accessibility audit, hide from screen readers */}
        {lists.length === 1 && (
          <div className="hidden md:invisible md:block">spacing</div>
        )}
        {lists.length <= 2 && (
          <div className="hidden md:invisible md:block">spacing</div>
        )}
      </div>
    </article>
  );
}
