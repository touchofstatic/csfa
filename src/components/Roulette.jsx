import { useState } from 'react';
import styles from '../styles/roulette.module.css';

export default function Roulette({ items }) {
  const [pull, setPull] = useState('');
  const [spinner, setSpinner] = useState(false);

  function randomize() {
    if (items.length > 0) {
      setPull('');
      setSpinner(true);
      setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * items.length);
        setPull(items[randomIndex]);
        setSpinner(false);
      }, 1000);
    }
  }

  return (
    <>
      <div className={styles.pull}>
        {spinner && (
          <span
            is-="spinner"
            variant-="dots"
          ></span>
        )}
        {pull.name}
      </div>
      <button
        size-="small"
        className="w-full"
        onClick={randomize}
      >
        [Roulette]
      </button>
    </>
  );
}
