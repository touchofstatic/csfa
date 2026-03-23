import Ascii from "./Ascii.jsx";
import Pomo from "./Pomo.jsx";

export default function Test() {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <aside className="mr-[1ch] mb-[1lh] flex w-[40ch] flex-col">
          <Ascii text="csfa" />
          <p>Total time: 00 minutes</p>
          <p>Pomodoros: 100500</p>
        </aside>
        <Pomo />
      </div>
    </>
  );
}
