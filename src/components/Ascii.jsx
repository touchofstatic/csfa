import {
  useAsciiText,
  // alligator,
  // fraktur,
  ansiShadow,
  // dosRebel,
  // deltaCorpsPriest1,
} from "react-ascii-text";

export default function Ascii({ text }) {
  const asciiTextRef = useAsciiText({
    font: ansiShadow,
    text: text,
    isAnimated: false,
  });

  // TODO: switch return style classes tailored for each font option; font is from user config like theme
  return (
    <pre
      ref={asciiTextRef}
      className="gradient text-[12px] md:block md:text-[17px]"
    ></pre>
  );
}
