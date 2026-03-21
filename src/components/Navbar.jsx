import Themes from "./Themes";
import Settings from "./Settings";
import SettingsPomo from "./SettingsPomo";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--foreground0)]">
      <Settings />
      <Themes />
      <SettingsPomo />
    </nav>
  );
}
