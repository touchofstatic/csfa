export default function Clock({ minutes, seconds }) {
  return (
    <>
      {/* TODO: kinda lame font? */}
      {/* possibly should go text-7xl on mobile but it seems fine */}
      {/* Important!!! block padding and leading control the clock no to invisibly overlap the button above and make it unclickable because of text-xl. remove noselect to see */}
      <section className="noselect bg-[var(--background1)] py-1 text-center text-8xl leading-tight">
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
