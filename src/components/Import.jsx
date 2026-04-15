import { useState, useRef, useContext } from "react";
import { ManagerContext } from "./Contexts";
import { itemsSchema, listsSchema } from "./schema.jsx";
import Ajv from "ajv";
import boxpad from "../styles/boxpad.module.css";

export default function Import() {
  const { handleImportBoard } = useContext(ManagerContext);
  const [result, setResult] = useState("none");
  // To hide the default file input, clicking the visible button clicks the actual file input via ref
  const fileInput = useRef(null);
  const exit = useRef();

  let message = "";
  switch (result) {
    case "none":
      message = "Are you sure? Current board will be overwritten.";
      break;
    case "succ":
      message = "File imported.";
      break;
    case "err1":
      message = "Error: Invalid file schema.";
      break;
    case "err2":
      message = "No file selected.";
      break;
    case "err3":
      message = "Error: Unsupported file type.";
      break;
    case "err4":
      message = "Error: Failed to read file.";
      break;
    default:
      message = "Unknown error.";
      break;
  }

  // We use Ajv library to validate structure in json files against schema of lists and items
  function isValid(schema, data) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, data);

    if (!valid) {
      setResult("err1");
      console.log(ajv.errors);
      return false;
    }
    setResult("succ");
    return true;
  }

  function importBoard(event) {
    const file = event.target.files[0];
    if (!file) {
      setResult("err2");
      return;
    }

    if (
      !file.type.startsWith("application/json") &&
      !file.type.endsWith(".json")
    ) {
      setResult("err3");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      if (
        isValid(itemsSchema, data.items) &&
        isValid(listsSchema, data.lists)
      ) {
        // If read file, json, and validated
        handleImportBoard(data.lists, data.items);
        // Clicks exit dialog to not make user click through a success message. Optimistic because handleImportBoard hasn't completed yet but I don't want to deal with managing Import's status message state in Board
        exit.current.click();
      }
    };
    reader.onerror = function () {
      setResult("err4");
    };
    reader.readAsText(file);
  }

  return (
    <>
      <button size-="small" command="show-modal" commandfor="import-dialog">
        Import board
      </button>

      <dialog
        id="import-dialog"
        popover="true"
        className={`h-4/5 w-full overflow-scroll md:h-[24ch]`}
      >
        <article
          className={`align-center flex h-full flex-col justify-center text-center ${boxpad.boxpad}`}
          box-="double"
        >
          <p>{message}</p>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInput}
            onChange={(event) => {
              importBoard(event);
              console.log(event.target.files[0].name);
            }}
            style={{ display: "none" }}
          ></input>
          <div className="flex justify-center gap-[1ch]">
            <button
              type="button"
              value="import"
              onClick={() => fileInput.current.click()}
            >
              Import
            </button>
            <button
              type="button"
              commandfor="import-dialog"
              command="close"
              onClick={() => setResult("none")}
              tabIndex="0"
              ref={exit}
            >
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
