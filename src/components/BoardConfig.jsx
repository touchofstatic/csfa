import { useContext, useState } from "react";
import { ManagerContext } from "./Contexts";
import Import from "./Import";
import Export from "./Export";
import ResetBoardConfig from "./ResetBoardConfig";

export default function BoardConfig() {
  // TODO: HORRIBLE HORRIBLE NAME
  const {
    stagesConfig,
    test,
    handleTest,
  } = useContext(ManagerContext);

  // I don't know if I agree with this const being scattered across the app. Also appears in Manager
  const MAX_COLORED_STAGES = 7;

  const [draftActiveStageCount, setDraftActiveStageCount] = useState(test);
  const [draftStageNames, setDraftStageNames] = useState(stagesConfig);

  // If has pending changes (to enable save button)
  const isDirty =
    draftActiveStageCount !== test ||
    stagesConfig.some((name, index) => name !== draftStageNames[index]);

  // Reset draft utility
  function resetDraft() {
    setDraftActiveStageCount(test);
    setDraftStageNames(stagesConfig);
  }

  const stagesdisplay = [];
  for (let i = 1; i <= MAX_COLORED_STAGES; i++) {
    const sdcolor = "bg-stage" + i;
    const isActive = i <= draftActiveStageCount;
    stagesdisplay.push(
      // AUDIT: see react.dev Optimizing re-rendering on every keystroke
      <input
        key={sdcolor}
        type="text"
        name={`stage-${i}`}
        minLength="1"
        maxLength="12"
        className={`${isActive ? sdcolor : "bg-[var(--background1)] text-[var(--foreground1)]"} w-[20ch]`}
        value={draftStageNames[i] || ""}
        onChange={(e) => {
          const next = [...draftStageNames];
          next[i] = e.target.value;
          setDraftStageNames(next);
        }}
        required={isActive}
      />,
    );
  }

  return (
    <>
      <button
        // command="show-modal"
        // commandfor="config-board-dialog"
        size-="small"
        className={`block w-full text-left hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
        onClick={() => {
          const dialog = document.getElementById(`config-board-dialog`);
          if (dialog) dialog.showPopover();
        }}
      >
        Board
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="config-board-dialog"
        popover="true"
        className={`max-h-dvh w-full md:w-[50ch]`}
        onToggle={(event) => {
          if (event.currentTarget.matches(":popover-open")) {
            resetDraft();
            console.log("a");
          }
        }}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col gap-[1lh]`}
          box-="double"
        >
          <h1 tabIndex="0">Settings/Board</h1>
          <section>
            <h2># Stages</h2>
            <p>
              Default configuration for creating new lists. Changing it will not
              overwrite existing ones.
            </p>
            {/* 
            <label htmlFor="stagesConfig">
              <input
                type="range"
                min="0"
                max="7"
                name="stagesConfig"
                value={stagesConfig.length - 1}
                onChange={(e) => {
                  handleResizeConfigStages(e.target.value);
                }}
                required
              />
              {stagesConfig.length - 1}
            </label> */}

            {/* Explicit stepper reduces accidental destructive changes */}
            <div className="flex items-center gap-[1ch]">
              <button
                type="button"
                onClick={() =>
                  setDraftActiveStageCount(
                    Math.max(0, draftActiveStageCount - 1),
                  )
                }
              >
                [-]
              </button>
              <span className="min-w-[2ch] text-center">
                {draftActiveStageCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setDraftActiveStageCount(
                    Math.min(MAX_COLORED_STAGES, draftActiveStageCount + 1),
                  )
                }
              >
                [+]
              </button>
            </div>

            <form
              className={`flex flex-col gap-1`}
              autoComplete="off"
              onSubmit={(event) => {
                event.preventDefault();
                handleTest(draftActiveStageCount, draftStageNames);
                // handleApplyListStagesSettings(
                //   list.id,
                //   draftActiveStageCount,
                //   draftStageNames,
                //   myItems,
                // );
              }}
            >
              {stagesdisplay}
              <div className="flex gap-[1ch]">
                <button type="submit" disabled={!isDirty}>
                  Save
                </button>
                <button
                  type="button"
                  disabled={!isDirty}
                  onClick={() => {
                    resetDraft();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>

          <section className="flex w-fit flex-col gap-1">
            <h2># Data</h2>
            <Import />
            <Export />
            <ResetBoardConfig />
          </section>

          <footer>
            <button
              // commandfor="config-board-dialog"
              // command="close"
              // onClick={(event) => {
              //   resetDraft();
              // }}
              type="button"
              onClick={(event) => {
                resetDraft();
                event.currentTarget.closest("dialog")?.hidePopover();
              }}
            >
              Exit
            </button>
          </footer>
        </article>
      </dialog>
    </>
  );
}
