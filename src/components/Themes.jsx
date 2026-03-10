import { useContext } from 'react';
import { ThemeContext } from './Contexts';
import styles from '../styles/navbar.module.css';
import idk from '../styles/idk.module.css';

export default function Themes() {
  const { changeTheme } = useContext(ThemeContext);

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
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-dark-hard')}
          >
            gruvbox dark hard
          </button>
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-dark-medium')}
          >
            gruvbox dark medium
          </button>
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-dark-soft')}
          >
            gruvbox dark soft
          </button>
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-light-hard')}
          >
            gruvbox light hard
          </button>
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-light-medium')}
          >
            gruvbox light medium
          </button>
          <button
            size-="small"
            onClick={() => changeTheme('gruvbox-light-soft')}
          >
            gruvbox light soft
          </button>
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
