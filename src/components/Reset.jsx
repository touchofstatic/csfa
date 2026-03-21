import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import idk from "../styles/idk.module.css";

export default function Reset() {
  const { handleReset } = useContext(ManagerContext);

  return (
    <>
      <button
        type="button"
        size-="small"
        command="show-modal"
        commandfor="reset-dialog"
      >
        Reset settings
      </button>
      <dialog
        id="reset-dialog"
        popover="true"
        className={`h-4/5 w-full md:h-[24ch]`}
      >
        <article
          className={`align-center flex h-full flex-col justify-center text-center ${idk.idk}`}
          box-="double"
        >
          <p>Are you sure?</p>
          <div className="flex justify-center gap-[1ch]">
            <button type="button" commandfor="reset-dialog" command="close">
              No
            </button>
            <button
              type="button"
              commandfor="reset-dialog"
              command="close"
              onClick={handleReset}
            >
              Yes
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
