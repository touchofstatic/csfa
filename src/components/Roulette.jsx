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

  const idk = <span className="gradient"></span>;

  return (
    <div className="flex flex-col gap-[0.5lh]">
      <div className={`${styles.pull} min-h-[3lh]`}>
        {spinner && (
          <span
            is-="spinner"
            variant-="dots"
          ></span>
        )}
        {!pull && !spinner ? idk : pull.name}
      </div>
      <button
        size-="small"
        className="w-full"
        onClick={randomize}
      >
        [Task Roulette]
      </button>
    </div>
  );
}
