import { useState } from "react";

// Random task productivity feature
export default function RandomItem({ items }) {
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        randomize();
      }}
      className="mb-[1lh] flex flex-col"
    >
      {/* TODO: align text and break very long word */}
      <output
        name="randomTask"
        aria-live="polite"
        className={`flex h-[3.5lh] w-full overflow-y-scroll bg-[var(--background1)] break-all`}
      >
        {/* Spinner component from webtui */}
        {spinner && <span is-="spinner" variant-="dots"></span>}
        <span>{pull?.name}</span>
      </output>
      <button type="submit" size-="small" className="w-full">
        [Random Task]
      </button>
    </form>
  );
}
