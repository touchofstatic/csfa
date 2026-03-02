import { useState } from 'react';

export default function Roulette({ items }) {
  const [pull, setPull] = useState('');
  // const [spinner, setSpinner] = useState(false);

  function randomize() {
    if (items.length > 0) {
      // let randomIndex = Math.floor(Math.random() * items.length);
      // setPull(items[randomIndex]);

      // setSpinner(true);
      setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * items.length);
        setPull(items[randomIndex]);
        // setSpinner(false);
      }, 1000);
    }
  }

  return (
    <div className="roulette grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(40ch,_1fr))] gap-[2ch]">
      {/* {spinner && (
        <span
          is-="spinner"
          variant-="dots"
        ></span>
      )} */}
      <div>
        <div className="roulettePull">{pull.name}</div>
        <div>
          <button
            className="w-full"
            onClick={randomize}
            style={{
              color: 'var(--background0)',
              backgroundColor: 'var(--foreground0)',
            }}
          >
            [roulette]
          </button>
        </div>
      </div>
      {/* TODO: slightly mismatched at breakpoint! */}
      <div className="hidden md:block">cool placeholder to fill out space</div>
    </div>
  );
}
