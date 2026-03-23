import Themes from "./Themes";
import SettingsTasks from "./SettingsTasks";
import SettingsPomo from "./SettingsPomo";

export default function Navbar() {
  return (
    <nav className="box-border w-dvw bg-[var(--foreground0)]">
      <SettingsTasks />
      <SettingsPomo />
      <Themes />
    </nav>
  );
}
