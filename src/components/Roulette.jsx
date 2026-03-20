import { useState } from "react";

export default function Roulette({ items }) {
  const [pull, setPull] = useState("");
  const [spinner, setSpinner] = useState(false);

  function randomize() {
    if (items.length > 0 && !spinner) {
      setPull("");
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
    <div className="flex flex-col gap-[0.5lh] md:flex-row">
      <div
        className={`flex min-h-[3lh] w-full items-center overflow-scroll border-3 border-[var(--background1)] px-[1ch]`}
      >
        {spinner && <span is-="spinner" variant-="dots"></span>}
        {!pull && !spinner ? idk : pull.name}
      </div>
      <button
        size-="small"
        className="w-full self-center md:w-[21ch]"
        onClick={randomize}
      >
        [Random]
      </button>
    </div>
  );
}
