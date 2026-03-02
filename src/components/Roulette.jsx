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
      }, 1500);
    }
  }

  return (
    <div className="roulette">
      <button onClick={randomize}>[roulette]</button>
      {/* {spinner && (
        <span
          is-="spinner"
          variant-="dots"
        ></span>
      )} */}
      <div className="roulettePull">{pull.name}</div>
    </div>
  );
}
