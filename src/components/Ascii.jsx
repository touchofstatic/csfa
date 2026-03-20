import {
  useAsciiText,
  alligator,
  fraktur,
  ansiShadow,
  dosRebel,
  deltaCorpsPriest1,
} from "react-ascii-text";

export default function Ascii({ text }) {
  const asciiTextRef = useAsciiText({
    font: deltaCorpsPriest1,
    text: text,
    isAnimated: false,
  });

  return (
    <pre
      ref={asciiTextRef}
      className="gradient hidden text-center text-[9px] md:block md:text-[13px]"
    ></pre>
  );
}
