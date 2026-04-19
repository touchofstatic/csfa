import Themes from "./Themes";
import BoardConfig from "./BoardConfig";
import ConfigPomo from "./ConfigPomo";

// Design guideline: based on navbars of software like Legacy BIOS and Norton Commander.
// Because the site is styled as software, some links styled as buttons might be necessary here
export default function Navbar() {
  return (
    // TODO+: combine board and pomo settings buttons into one dropdown menu button (like in vscode header). NOT activated by hover, only click
    <nav className="box-border w-dvw bg-[var(--foreground0)] shadow-md md:sticky md:top-0">
      <BoardConfig />
      <ConfigPomo />
      <Themes />
    </nav>
  );
}
