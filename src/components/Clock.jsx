export default function Clock({ minutes, seconds }) {

  return (
    <>
      <section className="text-[72px]">
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
