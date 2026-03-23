export default function Clock({ minutes, seconds }) {
  return (
    <>
      {/* TODO: change units? consider */}
      <section className="text-[90px]">
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
