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
    <section className="flex flex-col">
      {/* TODO: turn into form for accessibility */}
      <output
        className={`flex min-h-[3.5lh] w-full items-center justify-center overflow-scroll border-2 border-[var(--background2)]`}
      >
        {spinner && <span is-="spinner" variant-="dots"></span>}
        {!pull && !spinner ? (
          idk
        ) : (
          <span className="text-center">{pull.name}</span>
        )}
      </output>
      <button size-="small" className="w-full" onClick={randomize}>
        [Random Task]
      </button>
    </section>
  );
}
