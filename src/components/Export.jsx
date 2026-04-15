import { useContext } from "react";
import { ManagerContext } from "./Contexts";

export default function Export() {
  const { lists, items } = useContext(ManagerContext);

  function exportBoard() {
    // Create a file object json of lists and items
    const file = new Blob([JSON.stringify({ lists: lists, items: items })], {
      type: "application/json",
    });
    // Anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "csfa-" + Date.now() + ".json";
    // Simulate link click
    document.body.appendChild(element);
    // Required for it to work in FireFox
    element.click();
  }

  return (
    <button size-="small" value="export" onClick={exportBoard}>
      Export board
    </button>
  );
}
