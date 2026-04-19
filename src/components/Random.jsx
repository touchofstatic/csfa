import { useState } from "react";

// TODO: better name?
// Random task productivity feature
export default function Random({ items }) {
  const [pull, setPull] = useState("");
  // Track if spinner animation is playing
  const [spinner, setSpinner] = useState(false);

  function randomize() {
    if (items.length > 0 && !spinner) {
      setPull("");
      setSpinner(true);
      // Timeout is just to play the spinner animation
      setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * items.length);
        setPull(items[randomIndex]);
        setSpinner(false);
      }, 1000);
    }
  }

  return (
    <section className="mb-[1lh] flex flex-col">
      {/* TODO: turn into form */}
      {/* TODO: align text and break very long word */}
      <output
        className={`flex h-[3.5lh] w-full overflow-y-scroll bg-[var(--background1)] break-all`}
      >
        {/* Spinner component from webtui */}
        {spinner && <span is-="spinner" variant-="dots"></span>}
        <span>{pull.name}</span>
      </output>
      <button size-="small" className="w-full" onClick={randomize}>
        [Random Task]
      </button>
    </section>
  );
}
