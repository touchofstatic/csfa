import { useState } from "react";

export default function Random({ items }) {
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
    <div className="mb-[0.5lh] flex flex-col gap-[1ch]">
      <div
        className={`flex min-h-[2lh] w-full items-center overflow-scroll border-2 border-[var(--background2)] px-[1ch]`}
      >
        {spinner && <span is-="spinner" variant-="dots"></span>}
        {!pull && !spinner ? idk : pull.name}
      </div>
      <button size-="small" className="w-full self-center" onClick={randomize}>
        [Random Task]
      </button>
    </div>
  );
}
