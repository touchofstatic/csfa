import { useState } from 'react';

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
      <div className="roulettePull">
        {spinner && (
          <span
            is-="spinner"
            variant-="dots"
          ></span>
        )}
        {pull.name}
      </div>
      <div>
        <button
          className="w-full"
          onClick={randomize}
        >
          [Roulette]
        </button>
      </div>
    </>
  );
}
