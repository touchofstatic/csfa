import { useAsciiText, ansiShadow } from "react-ascii-text";

export function Ascii({ text }) {
  const asciiTextRef = useAsciiText({
    font: ansiShadow,
    text: text,
    isAnimated: false,
  });
  return <pre ref={asciiTextRef} className="block text-[10px]"></pre>;
}

export default function About() {
  return (
    <>
      <button
        command="show-modal"
        commandfor="about-dialog"
        size-="small"
        className={`hover:bg-[var(--foreground2)] active:bg-[var(--background0)]`}
      >
        About
      </button>

      <dialog
        id="about-dialog"
        popover="true"
        className={`max-h-dvh w-full md:w-[50ch]`}
      >
        <article
          className={`dialog-webtuibox-spacing flex h-full flex-col gap-[1lh]`}
          box-="double"
        >
          <h1 tabIndex="0">About</h1>

          <Ascii text="csfa" />

          <section>
            <p>CSFA v0.0</p>
            <p>Copyright © 2026 touchofstatic.</p>
            <a href="https://github.com/touchofstatic/csfa">
              https://github.com/touchofstatic/csfa
            </a>
          </section>

          {/* TODO: credits section */}
          {/* <section>
            <h2># Credits</h2>
            <a href="https://webtui.ironclad.sh/">WebTUI</a>
            <a href="https://github.com/samuelweckstrom/react-ascii-text">
              React ASCII Text
            </a>
          </section> */}

          <footer>
            <button commandfor="about-dialog" command="close">
              Exit
            </button>
          </footer>
        </article>
      </dialog>
    </>
  );
}
