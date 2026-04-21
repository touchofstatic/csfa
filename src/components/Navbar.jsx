import { useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import Themes from "./Themes";
import BoardConfig from "./BoardConfig";
import PomodoroConfig from "./PomodoroConfig";
import styles from "../styles/navbar.module.css";

// Design guideline: based on navbars of software like Legacy BIOS and Norton Commander.
// Because the site is styled as software, some links styled as buttons might be necessary here
export default function Navbar() {
  // TODO: clicking on either Config button should close details dropdown too
  const detailsRef = useRef(null);
  const clickAwayRef = useClickAway(() => {
    detailsRef.current.open = false;
  });

  return (
    // Kinda ass to combine css modules and tailwind like that but I've already done it a thousand times here and there's so many moving parts in the details dropdown's styles
    <nav className="z-1001 box-border flex w-dvw bg-[var(--foreground0)] shadow-md md:sticky md:top-0">
      <details
        is-="popover"
        className={`noselect relative`}
        ref={(ref) => {
          detailsRef.current = ref;
          clickAwayRef.current = ref;
        }}
      >
        {/* Dropdown "button". Style should match other buttons on navbar */}
        <summary className={`${styles.summary}`}>Config</summary>
        {/* Buttons in dropdown */}
        <div className="absolute z-1001 w-[16ch]">
          <BoardConfig detailsRef={detailsRef} />
          <PomodoroConfig detailsRef={detailsRef} />
        </div>
      </details>
      <Themes />
    </nav>
  );
}
