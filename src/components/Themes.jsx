import { useContext } from "react";
import { ThemeContext } from "./Contexts";

// Themes provided by webtui https://webtui.ironclad.sh/start/plugins/
const THEMES_STANDARD = [
  "gruvbox-dark-hard",
  "gruvbox-dark-medium",
  "gruvbox-dark-soft",
  "gruvbox-light-hard",
  "gruvbox-light-medium",
  "gruvbox-light-soft",
  "nord",
  "catppuccin-mocha",
  "catppuccin-macchiato",
  "catppuccin-frappe",
];

// Our themes based on colors from webtui themes
const THEMES_CUSTOM = ["catppuccin-pink", "colder-nord"];

export default function Themes() {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="themes-dialog"
        size-="small"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        Themes
      </button>

      {/* Dimensions subject to change */}
      <dialog
        id="themes-dialog"
        popover="true"
        className={`h-4/5 w-full md:h-[50ch]`}
      >
        <article
          className={`align-center dialog-webtuibox-spacing flex h-full flex-col justify-center`}
          box-="double"
        >
          {/* tabIndex focuses dialog's header instead of first input which is the default*/}
          <h1 tabIndex="0">Themes</h1>
          {/* TODO: accessibility audit */}
          {/* Color scheme ui element that showcases the current theme as a row of color blocks. It's common in tui, for example the linux terminal. Purely visual, not relevant to screen readers */}
          <div className="noselect">
            <span className="bg-[var(--foreground0)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--foreground1)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--foreground2)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--background0)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--background1)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--background2)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--background3)]">&nbsp;&nbsp;</span>
          </div>

          <div className="noselect">
            <span className="bg-[var(--color0)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color1)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color2)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color3)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color4)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color5)]">&nbsp;&nbsp;</span>
            <span className="bg-[var(--color6)]">&nbsp;&nbsp;</span>
          </div>

          <section>
            {/* Current theme is strongly highlighted in foreground. hovering highlights slightly */}
            {/* Known issue: hovering and tab focusing at the same time creates two hightlights. Low priority */}
            {THEMES_STANDARD.map((t) => (
              <button
                size-="small"
                onClick={() => changeTheme(t)}
                value={t}
                key={t}
                className={`block w-full text-left ${t === theme ? `bg-[var(--foreground0)] text-[var(--background0)]` : `bg-[var(--background1)] text-[var(--foreground0)] hover:bg-[var(--background2)] focus:bg-[var(--background2)]`}`}
              >
                {t}
              </button>
            ))}
          </section>
          <h2># Extra</h2>
          <section>
            {THEMES_CUSTOM.map((t) => (
              <button
                size-="small"
                onClick={() => changeTheme(t)}
                value={t}
                key={t}
                className={`block w-full text-left ${t === theme ? `bg-[var(--foreground0)] text-[var(--background0)]` : `bg-[var(--background1)] text-[var(--foreground0)] hover:bg-[var(--background2)] focus:bg-[var(--background2)]`}`}
              >
                {t}
              </button>
            ))}
          </section>
          <div className="flex justify-center">
            <button commandfor="themes-dialog" command="close">
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
