import { useContext } from "react";
import { ManagerContext } from "./Contexts";

// Task board config's reset button and dialog
export default function ResetBoardConfig() {
  const { resetBoardConfig } = useContext(ManagerContext);

  return (
    <>
      <button
        type="button"
        size-="small"
        command="show-modal"
        commandfor="reset-board-config-dialog"
      >
        Reset settings
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="reset-board-config-dialog"
        popover="true"
        className={`h-4/5 w-full md:h-[24ch]`}
      >
        <article
          className={`align-center dialog-webtuibox-spacing flex h-full flex-col justify-center text-center`}
          box-="double"
        >
          <p>Reset user's task board settings.</p>
          <p>Are you sure?</p>
          <div className="flex justify-center gap-[1ch]">
            <button
              type="button"
              commandfor="reset-board-config-dialog"
              command="close"
            >
              No
            </button>
            <button
              type="button"
              commandfor="reset-board-config-dialog"
              command="close"
              onClick={resetBoardConfig}
            >
              Yes
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
