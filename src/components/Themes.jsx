import { useContext } from 'react';
import { ThemeContext } from './Contexts';
import styles from '../styles/navbar.module.css';
import idk from '../styles/idk.module.css';

// TODO: temporary
const THEMES_DEFAULT = [
  'gruvbox-dark-hard',
  'gruvbox-dark-medium',
  'gruvbox-dark-soft',
  'gruvbox-light-hard',
  'gruvbox-light-medium',
  'gruvbox-light-soft',
];

export default function Themes() {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <>
      <button
        command="show-modal"
        commandfor="themes-dialog"
        size-="small"
        className={styles.navbutton}
      >
        Themes
      </button>

      <dialog
        id="themes-dialog"
        popover="true"
        className={`h-4/5 md:h-[30ch] w-full`}
      >
        <article
          className={`flex flex-col align-center justify-center h-full ${idk.article}`}
          box-="double"
        >
          <section>
            {THEMES_DEFAULT.map((t) => (
              <button
                size-="small"
                onClick={() => changeTheme(t)}
                value={t}
                className={`block w-full text-left ${t === theme ? `bg-[var(--foreground0)] text-[var(--background0)]` : `bg-[var(--background1)] text-[var(--foreground0)]`}`}
              >
                {t}
              </button>
            ))}
          </section>
          <div className="flex justify-center">
            <button
              commandfor="themes-dialog"
              command="close"
            >
              Exit
            </button>
          </div>
        </article>
      </dialog>
    </>
  );
}
