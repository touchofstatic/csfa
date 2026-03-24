import Themes from "./Themes";
import SettingsBoard from "./SettingsBoard";
import SettingsPomo from "./SettingsPomo";

export default function Navbar() {
  return (
    <nav className="box-border w-dvw bg-[var(--foreground0)] shadow-md md:sticky md:top-0">
      <SettingsBoard />
      <SettingsPomo />
      <Themes />
    </nav>
  );
}
