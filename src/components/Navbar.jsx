import Themes from "./Themes";
import Settings from "./Settings";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--foreground0)]">
      <Settings />
      <Themes />
    </nav>
  );
}
