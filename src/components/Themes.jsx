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
const THEMES_CUSTOM = [
  "catppuccin-pink",
  "colder-nord",
  "solarized-dark",
  "solarized-light",
  "selenized-dark",
  "selenized-light",
];

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

      <dialog
        id="themes-dialog"
        popover="true"
        className={`max-h-dvh w-full md:h-[31lh]`}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col gap-[1lh]`}
          box-="double"
        >
          {/* tabIndex focuses dialog's header instead of first input which is the default*/}
          <h1 tabIndex="0">Themes</h1>
          {/* Color scheme ui element that showcases the current theme as a row of color blocks. It's common in tui, for example the linux terminal. Purely visual, not relevant to screen readers */}
          <p className="noselect" aria-hidden="true">
            {/* Base colors */}
            <div>
              <span className="bg-[var(--foreground0)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--foreground1)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--foreground2)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--background0)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--background1)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--background2)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--background3)]">&nbsp;&nbsp;</span>
            </div>
            {/* Accent colors */}
            <div>
              <span className="bg-[var(--color0)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color1)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color2)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color3)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color4)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color5)]">&nbsp;&nbsp;</span>
              <span className="bg-[var(--color6)]">&nbsp;&nbsp;</span>
            </div>
          </p>

          <section>
            {/* Current theme is strongly highlighted in foreground. hovering highlights slightly */}
            {/* KNOWN ISSUE: hovering and tab focusing at the same time creates two hightlights. Low priority */}
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

          {/* "<footer> instead of <section> for the exit button — The closing button is the dialog's footer, not a content section. Using <footer> is more semantically accurate HTML (it signals "this is the closing/action area of this landmark") and helps screen readers understand the page structure better. It's a small change but good habit." */}
          <footer>
            <button commandfor="themes-dialog" command="close">
              Exit
            </button>
          </footer>
        </article>
      </dialog>
    </>
  );
}
