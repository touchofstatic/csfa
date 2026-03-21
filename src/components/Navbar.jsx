import Export from "./Export";
import Import from "./Import";
import Themes from "./Themes";
import Settings from "./Settings";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--foreground0)]">
      <Export />
      <Import />
      <Themes />
      <Settings />
    </nav>
  );
}
