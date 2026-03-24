import { useContext } from "react";
import { ManagerContext } from "./Contexts";
import boxpad from "../styles/boxpad.module.css";

export default function Reset() {
  const { resetSettingsConfig } = useContext(ManagerContext);

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
          className={`align-center flex h-full flex-col justify-center text-center ${boxpad.boxpad}`}
          box-="double"
        >
          <p>
            Reset user's task board settings to app default. Other settings and
            data will not be erased.
          </p>
          <p>Are you sure?</p>
          <div className="flex justify-center gap-[1ch]">
            <button type="button" commandfor="reset-dialog" command="close">
              No
            </button>
            <button
              type="button"
              commandfor="reset-dialog"
              command="close"
              onClick={resetSettingsConfig}
            >
              Yes
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
