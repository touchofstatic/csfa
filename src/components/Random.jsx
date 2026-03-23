import { useState } from "react";

export default function Random({ items }) {
  const [pull, setPull] = useState("");
  const [spinner, setSpinner] = useState(false);
  const coolplaceholderidk = (
    <span className="gradient">cool placeholder words (tenative)</span>
  );

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

  return (
    <section className="mb-[1lh] flex flex-col">
      {/* TODO: turn into form for accessibility */}
      {/* TODO: align words and break very long word */}
      <output
        className={`flex h-[3.5lh] w-full overflow-y-scroll border-2 border-[var(--background2)] break-all`}
      >
        {spinner && <span is-="spinner" variant-="dots"></span>}
        {!pull && !spinner ? coolplaceholderidk : <span>{pull.name}</span>}
      </output>
      <button size-="small" className="w-full" onClick={randomize}>
        [Random Task]
      </button>
    </section>
  );
}
