export default function Clock({ minutes, seconds }) {
  return (
    <>
      {/* TODO: kinda lame font? */}
      {/* possibly should go text-7xl on mobile but it seems fine */}
      <section className="noselect bg-[var(--background1)] text-center text-8xl">
        <span>
          {minutes < 10 ? "0" : ""}
          {minutes}
        </span>
        :
        <span>
          {seconds < 10 ? "0" : ""}
          {seconds}
        </span>
      </section>
    </>
  );
}
