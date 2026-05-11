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
      className="mb-[2lh] flex flex-col gap-[1ch]"
    >
      <output
        name="randomTask"
        aria-live="polite"
        className={`breakword flex h-[3lh] w-full content-center overflow-y-scroll bg-[var(--background1)] px-[1ch]`}
      >
        {spinner && (
          <span className="content-center">
            {/* Spinner component from webtui */}
            <span is-="spinner" variant-="dots"></span>
          </span>
        )}
        <span className="content-center">{pull?.name}</span>
      </output>
      <button type="submit" size-="small" className="w-full">
        [Random task]
      </button>
    </form>
  );
}
